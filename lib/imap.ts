import imaps from 'imap-simple';
import { simpleParser } from 'mailparser';

export async function fetchEmailsWithOAuth2(email: string, accessToken: string) {

  const xoauth2str = Buffer.from(
    [
      'user=' + email,
      'auth=Bearer ' + accessToken,
      '',
      ''
    ].join('\x01'),
    'utf-8'
  ).toString('base64');

  const config = {
    imap: {
      user: email,
      xoauth2: xoauth2str,
      host: 'imap.gmail.com',
      port: 993,
      tls: true,
      authTimeout: 10000,
      tlsOptions: { rejectUnauthorized: false },
    }
  };

  try {
    const connection = await imaps.connect(config);
    await connection.openBox('INBOX');

    // Only fetch unseen emails from the last 1 day
    const since = new Date();
    since.setDate(since.getDate() - 1);
    const searchCriteria = [
      ['SINCE', since.toISOString().slice(0, 10)]
    ];

    const fetchOptions = { bodies: [''], markSeen: false };

    const results = await connection.search(searchCriteria, fetchOptions);

    const emails = [];
    for (const res of results) {
      const all = res.parts.find((part: any) => part.which === '');
      if (all) {
        const parsed = await simpleParser(all.body);
        emails.push({
          from: parsed.from?.text,
          subject: parsed.subject,
          text: parsed.text,
        });
      }
    }

    await connection.end();
    return emails;
  } catch (error) {
    console.error('IMAP error:', error);
    throw error;
  }
}
