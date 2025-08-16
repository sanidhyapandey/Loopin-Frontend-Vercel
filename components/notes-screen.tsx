import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, Calendar, Users, Tag, MoreHorizontal } from "lucide-react"

export function NotesScreen() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar would be here - same as in DashboardScreen */}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navigation would be here - same as in DashboardScreen */}

        {/* Notes content */}
        <main className="flex-1 overflow-hidden flex">
          {/* Notes sidebar */}
          <div className="w-80 border-r border-gray-200 bg-white flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Notes</h2>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  New
                </Button>
              </div>

              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input placeholder="Search notes..." className="pl-8" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="py-2">
                <div className="px-4 py-1 text-xs font-semibold text-gray-500">RECENT NOTES</div>

                {/* Note list items */}
                <div className="px-2">
                  {/* Active note */}
                  <div className="p-2 rounded-md bg-blue-50 border border-blue-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">Product Design Meeting Notes</h3>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          Key points from the design review meeting with Sarah and team...
                        </p>
                      </div>
                      <span className="text-xs text-gray-500">2d</span>
                    </div>
                    <div className="flex items-center mt-2">
                      <div className="flex items-center text-xs text-gray-500 mr-3">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>Jun 15</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Users className="h-3 w-3 mr-1" />
                        <span>5 people</span>
                      </div>
                    </div>
                  </div>

                  {/* Other notes */}
                  {["User Research Findings", "Project Timeline", "Client Feedback", "Team Standup"].map((title, i) => (
                    <div key={i} className="p-2 rounded-md hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{title}</h3>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {i === 0
                              ? "Summary of user testing sessions conducted last week..."
                              : i === 1
                                ? "Updated timeline for Q3 deliverables and milestones..."
                                : i === 2
                                  ? "Feedback from client meeting regarding the latest prototype..."
                                  : "Daily updates from the engineering and design teams..."}
                          </p>
                        </div>
                        <span className="text-xs text-gray-500">{i + 3}d</span>
                      </div>
                      <div className="flex items-center mt-2">
                        <div className="flex items-center text-xs text-gray-500 mr-3">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>Jun {12 - i}</span>
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <Tag className="h-3 w-3 mr-1" />
                          <span>{i === 0 ? "Research" : i === 1 ? "Planning" : i === 2 ? "Client" : "Team"}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Note editor */}
          <div className="flex-1 flex flex-col">
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Product Design Meeting Notes</h2>
                  <div className="flex items-center text-gray-500 mt-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span className="text-sm mr-3">June 15, 2023</span>
                    <Users className="h-4 w-4 mr-1" />
                    <span className="text-sm">5 participants</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Users className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                  <Button variant="outline" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <Tabs defaultValue="note">
                <TabsList className="mb-4">
                  <TabsTrigger value="note">Note</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  <TabsTrigger value="related">Related Items</TabsTrigger>
                </TabsList>

                <TabsContent value="note">
                  <Card>
                    <CardContent className="p-6">
                      <div className="prose max-w-none">
                        <h2>Product Design Review Meeting</h2>
                        <p>
                          <strong>Date:</strong> June 15, 2023
                        </p>
                        <p>
                          <strong>Participants:</strong> John, Sarah, Michael, Emily, David
                        </p>

                        <h3>Agenda</h3>
                        <ol>
                          <li>Review of updated dashboard mockups</li>
                          <li>Discussion of user testing results</li>
                          <li>Next steps for implementation</li>
                        </ol>

                        <h3>Key Points</h3>
                        <ul>
                          <li>Sarah presented the updated dashboard UI components with improved navigation</li>
                          <li>Emily shared insights from user testing - overall positive feedback on the new layout</li>
                          <li>David discussed technical feasibility and implementation timeline</li>
                        </ul>

                        <h3>Decisions</h3>
                        <ul>
                          <li>Approved the new dashboard design with minor adjustments to the sidebar</li>
                          <li>Will proceed with the implementation in two phases</li>
                          <li>Phase 1: Core components and layout (2 weeks)</li>
                          <li>Phase 2: Advanced features and data visualization (3 weeks)</li>
                        </ul>

                        <h3>Action Items</h3>
                        <ul>
                          <li>Sarah: Finalize design adjustments by Friday</li>
                          <li>David: Create component specifications for the engineering team</li>
                          <li>Michael: Update the project timeline and resource allocation</li>
                          <li>Emily: Schedule another round of user testing for Phase 1 deliverables</li>
                          <li>John: Coordinate with stakeholders and provide progress updates</li>
                        </ul>

                        <h3>Next Meeting</h3>
                        <p>Progress review scheduled for June 22, 2023</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
