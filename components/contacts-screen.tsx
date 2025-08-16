import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, Plus, Mail, Calendar, MoreHorizontal, Building, MapPin } from "lucide-react"

export function ContactsScreen() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar would be here - same as in DashboardScreen */}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navigation would be here - same as in DashboardScreen */}

        {/* Contacts content */}
        <main className="flex-1 overflow-hidden flex">
          {/* Contact list sidebar */}
          <div className="w-80 border-r border-gray-200 bg-white flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Contacts</h2>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>

              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input placeholder="Search contacts..." className="pl-8" />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="py-2">
                <div className="px-4 py-1 text-xs font-semibold text-gray-500">RECENT CONTACTS</div>

                {/* Contact list items */}
                <div className="px-2">
                  {/* Active contact */}
                  <div className="flex items-center p-2 rounded-md bg-blue-50 border border-blue-100">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Sarah Lee" />
                      <AvatarFallback>SL</AvatarFallback>
                    </Avatar>
                    <div className="ml-3 flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">Sarah Lee</p>
                      <p className="text-xs text-gray-500 truncate">Product Designer at Figma</p>
                    </div>
                  </div>

                  {/* Other contacts */}
                  {["Alex Kim", "Michael Johnson", "Emily Chen", "David Wilson"].map((name, i) => (
                    <div key={i} className="flex items-center p-2 rounded-md hover:bg-gray-50">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${name.charAt(0)}`} alt={name} />
                        <AvatarFallback>
                          {name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="ml-3 flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
                        <p className="text-xs text-gray-500 truncate">
                          {i % 2 === 0 ? "Software Engineer" : "Product Manager"} at{" "}
                          {["Google", "Microsoft", "Apple", "Amazon"][i % 4]}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contact detail view */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="/placeholder.svg?height=64&width=64" alt="Sarah Lee" />
                    <AvatarFallback>SL</AvatarFallback>
                  </Avatar>
                  <div className="ml-4">
                    <h1 className="text-2xl font-bold">Sarah Lee</h1>
                    <div className="flex items-center text-gray-500">
                      <Building className="h-4 w-4 mr-1" />
                      <span className="text-sm">Product Designer at Figma</span>
                    </div>
                    <div className="flex items-center text-gray-500 mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">San Francisco, CA</span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <Mail className="h-4 w-4 mr-1" />
                    Email
                  </Button>
                  <Button size="sm" variant="outline">
                    <Calendar className="h-4 w-4 mr-1" />
                    Schedule
                  </Button>
                  <Button size="sm" variant="outline">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Introduction Chain</h2>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32&text=JD" alt="John Doe" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div className="mx-2 text-gray-400">→</div>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32&text=MJ" alt="Michael Johnson" />
                        <AvatarFallback>MJ</AvatarFallback>
                      </Avatar>
                      <div className="mx-2 text-gray-400">→</div>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Sarah Lee" />
                        <AvatarFallback>SL</AvatarFallback>
                      </Avatar>
                      <div className="ml-3">
                        <p className="text-sm">
                          <span className="font-medium">Michael Johnson</span> introduced you on March 15, 2023
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Tabs defaultValue="timeline">
                <TabsList className="mb-4">
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  <TabsTrigger value="emails">Emails</TabsTrigger>
                  <TabsTrigger value="meetings">Meetings</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                </TabsList>

                <TabsContent value="timeline" className="space-y-4">
                  {/* Timeline items */}
                  <div className="space-y-4">
                    <div className="flex">
                      <div className="flex flex-col items-center mr-4">
                        <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                        <div className="h-full w-0.5 bg-gray-200"></div>
                      </div>
                      <div className="flex-1">
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <Badge variant="outline" className="mb-2">
                                  Meeting
                                </Badge>
                                <h3 className="font-medium">Product Design Review</h3>
                                <p className="text-sm text-gray-500">Discussed new dashboard wireframes</p>
                              </div>
                              <span className="text-xs text-gray-500">2 days ago</span>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    <div className="flex">
                      <div className="flex flex-col items-center mr-4">
                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                        <div className="h-full w-0.5 bg-gray-200"></div>
                      </div>
                      <div className="flex-1">
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <Badge variant="outline" className="mb-2">
                                  Email
                                </Badge>
                                <h3 className="font-medium">New Mockups Shared</h3>
                                <p className="text-sm text-gray-500">Sarah sent the updated mockups for review</p>
                              </div>
                              <span className="text-xs text-gray-500">1 week ago</span>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    <div className="flex">
                      <div className="flex flex-col items-center mr-4">
                        <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                        <div className="h-full w-0.5 bg-gray-200"></div>
                      </div>
                      <div className="flex-1">
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <Badge variant="outline" className="mb-2">
                                  Note
                                </Badge>
                                <h3 className="font-medium">Design Feedback</h3>
                                <p className="text-sm text-gray-500">Notes from our initial design discussion</p>
                              </div>
                              <span className="text-xs text-gray-500">2 weeks ago</span>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    <div className="flex">
                      <div className="flex flex-col items-center mr-4">
                        <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                        <div className="h-full w-0.5 bg-gray-200"></div>
                      </div>
                      <div className="flex-1">
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <Badge variant="outline" className="mb-2">
                                  Introduction
                                </Badge>
                                <h3 className="font-medium">First Introduction</h3>
                                <p className="text-sm text-gray-500">Michael Johnson introduced Sarah via email</p>
                              </div>
                              <span className="text-xs text-gray-500">March 15, 2023</span>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
