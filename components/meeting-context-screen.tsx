import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Calendar, FileText, Mail, Video, Mic, Phone, Plus } from "lucide-react"

export function MeetingContextScreen() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar would be here - same as in DashboardScreen */}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navigation would be here - same as in DashboardScreen */}

        {/* Meeting context content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Product Design Review</h1>
                <div className="flex items-center text-gray-500 mt-1">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span className="text-sm mr-3">Wednesday, June 15, 2023</span>
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="text-sm">10:00 - 11:00 AM</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline">
                  <Calendar className="h-4 w-4 mr-1" />
                  Add to Calendar
                </Button>
                <Button>
                  <Video className="h-4 w-4 mr-1" />
                  Join Meeting
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Left column - Meeting details */}
            <div className="col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Meeting Context</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Description</h3>
                      <p className="text-sm text-gray-600">
                        Review the latest design mockups for the dashboard and discuss next steps for implementation.
                        Sarah will present the updated UI components and we&apos;ll provide feedback.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-2">Participants (5)</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {["John Doe (You)", "Sarah Lee", "Michael Johnson", "Emily Chen", "David Wilson"].map(
                          (name, i) => (
                            <div key={i} className="flex items-center">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={`/placeholder.svg?height=32&width=32&text=${name.charAt(0)}`}
                                  alt={name}
                                />
                                <AvatarFallback>
                                  {name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div className="ml-2">
                                <p className="text-sm font-medium">{name}</p>
                                <p className="text-xs text-gray-500">
                                  {i === 0
                                    ? "Product Manager"
                                    : i === 1
                                      ? "Product Designer"
                                      : i === 2
                                        ? "Engineering Lead"
                                        : i === 3
                                          ? "UX Researcher"
                                          : "Frontend Developer"}
                                </p>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-2">Relationship Context</h3>
                      <div className="text-sm text-gray-600">
                        <p>Sarah was introduced to the team by Michael 3 months ago.</p>
                        <p>You&apos;ve had 5 previous meetings with Sarah in the last month.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Tabs defaultValue="previous">
                <TabsList className="mb-4">
                  <TabsTrigger value="previous">Previous Interactions</TabsTrigger>
                  <TabsTrigger value="files">Related Files</TabsTrigger>
                  <TabsTrigger value="notes">Meeting Notes</TabsTrigger>
                </TabsList>

                <TabsContent value="previous" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Previous Meeting (June 8)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-start">
                          <Badge variant="outline" className="mt-0.5 mr-2">
                            Summary
                          </Badge>
                          <p className="text-sm text-gray-600">
                            Discussed initial wireframes for the dashboard redesign. Sarah presented the first draft of
                            UI components. Team provided feedback on the layout and navigation structure.
                          </p>
                        </div>

                        <div className="flex items-start">
                          <Badge variant="outline" className="mt-0.5 mr-2">
                            Action Items
                          </Badge>
                          <div className="text-sm text-gray-600">
                            <ul className="list-disc list-inside space-y-1">
                              <li>Sarah to update mockups based on feedback</li>
                              <li>David to prepare component library for implementation</li>
                              <li>Emily to conduct user testing on navigation concepts</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Recent Emails</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-start">
                          <Mail className="h-5 w-5 mr-2 text-gray-400" />
                          <div>
                            <div className="flex items-center">
                              <p className="text-sm font-medium">Updated Design Mockups</p>
                              <span className="text-xs text-gray-500 ml-2">Yesterday at 4:32 PM</span>
                            </div>
                            <p className="text-sm text-gray-600">
                              Sarah shared the updated mockups for review before today&apos;s meeting.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <Mail className="h-5 w-5 mr-2 text-gray-400" />
                          <div>
                            <div className="flex items-center">
                              <p className="text-sm font-medium">User Testing Results</p>
                              <span className="text-xs text-gray-500 ml-2">2 days ago</span>
                            </div>
                            <p className="text-sm text-gray-600">
                              Emily shared the results from the latest user testing session.
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right column - Live meeting */}
            <div className="col-span-1 space-y-6">
              <Card className="overflow-hidden">
                <div className="bg-gray-800 aspect-video relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Video className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Meeting will begin soon</p>
                    </div>
                  </div>

                  {/* Video thumbnails */}
                  <div className="absolute bottom-2 right-2 flex space-x-2">
                    <div className="h-16 w-24 bg-gray-700 rounded overflow-hidden">
                      <div className="h-full w-full flex items-center justify-center">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-900 flex items-center justify-between">
                  <div className="text-white text-sm">
                    <span className="text-red-400">●</span> Recording
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="rounded-full bg-gray-800 text-white hover:bg-gray-700"
                    >
                      <Mic className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="rounded-full bg-gray-800 text-white hover:bg-gray-700"
                    >
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="destructive" className="rounded-full">
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Live Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-md p-3 bg-gray-50 min-h-[200px]">
                    <p className="text-sm text-gray-600">
                      Meeting transcription and AI-generated notes will appear here during the meeting.
                    </p>
                  </div>

                  <div className="mt-4">
                    <Button className="w-full">
                      <FileText className="h-4 w-4 mr-1" />
                      Generate Meeting Summary
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Follow-up Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input type="checkbox" id="task1" className="h-4 w-4 rounded border-gray-300" />
                      <label htmlFor="task1" className="ml-2 text-sm">
                        Share updated mockups with team
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="task2" className="h-4 w-4 rounded border-gray-300" />
                      <label htmlFor="task2" className="ml-2 text-sm">
                        Schedule follow-up with Sarah
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="task3" className="h-4 w-4 rounded border-gray-300" />
                      <label htmlFor="task3" className="ml-2 text-sm">
                        Review implementation timeline
                      </label>
                    </div>

                    <div className="pt-2">
                      <Button variant="ghost" size="sm" className="w-full border border-dashed">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Task
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
