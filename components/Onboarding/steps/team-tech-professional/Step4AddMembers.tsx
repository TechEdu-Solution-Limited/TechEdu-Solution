"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X, Plus, Search, User, Mail } from "lucide-react";
import { postApiRequest, getApiRequest } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";
import { toast } from "react-toastify";

interface Step4AddMembersProps {
  form: any;
  errors: { [key: string]: string };
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  teamId?: string;
  userId?: string;
}

export function Step4AddMembers({
  form,
  errors,
  handleChange,
  teamId,
  userId,
}: Step4AddMembersProps) {
  // Debug: Log the teamId to ensure it's being passed correctly
  console.log("🔍 Step4AddMembers - teamId prop:", teamId);
  console.log("🔍 Step4AddMembers - form.teamId:", form.teamId);
  console.log("🔍 Step4AddMembers - form object:", form);

  const [newMember, setNewMember] = useState({
    userId: "",
    email: "",
    fullName: "",
    role: "",
  });

  const [pendingMembers, setPendingMembers] = useState<any[]>([]);
  const [loadingInvite, setLoadingInvite] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);

  // Individual Tech Professionals search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [searchingUser, setSearchingUser] = useState(false);

  // Search individual tech professional by email
  const searchUserByEmail = async (email: string) => {
    if (!email.trim() || email.trim().length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setSearchingUser(true);
    try {
      const token = getTokenFromCookies();
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await getApiRequest(
        `/api/users/profile/email/${encodeURIComponent(email)}`,
        token
      );
      console.log("Full email response", JSON.stringify(response));

      if (response.status < 400 && response.data?.data?.user) {
        // Extract user data from the nested response structure
        const userData = {
          _id: response.data.data.user._id,
          email: response.data.data.user.email,
          fullName: response.data.data.user.fullName,
          isVerified: response.data.data.user.isVerified,
          profile: response.data.data.profile,
        };
        setSearchResults([userData]);
        setShowSearchResults(true);
      } else {
        setSearchResults([]);
        setShowSearchResults(true);
      }
    } catch (error) {
      console.error("Failed to search user:", error);
      setSearchResults([]);
      setShowSearchResults(true);
    } finally {
      setSearchingUser(false);
    }
  };

  // Manual search functionality
  const handleSearch = () => {
    if (searchQuery.trim().length >= 2) {
      searchUserByEmail(searchQuery.trim());
    } else {
      toast.warning("Please enter at least 2 characters to search");
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  // Click outside handler to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".search-dropdown")) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectUser = (user: any) => {
    setSelectedUser(user);
    setNewMember({
      userId: user._id || user.id || "",
      email: user.email || "",
      fullName: user.fullName || "",
      role: user.role || "",
    });
    setSearchQuery(user.email || "");
    setShowSearchResults(false);
    toast.success("User selected successfully!");
  };

  const addToPendingList = () => {
    if (
      !newMember.userId ||
      !newMember.email ||
      !newMember.fullName ||
      !newMember.role
    ) {
      toast.error("Please search and select a user, then fill in the role");
      return;
    }

    // Check if member already exists in pending list
    const existsInPending = pendingMembers.some(
      (member) => member.email === newMember.email
    );

    if (existsInPending) {
      toast.warning("This member is already in the pending list");
      return;
    }

    // Add to pending list
    setPendingMembers((prev) => [...prev, { ...newMember }]);

    // Reset new member inputs
    setNewMember({
      userId: "",
      email: "",
      fullName: "",
      role: "",
    });
    setSelectedUser(null);
    setSearchQuery("");

    toast.success("Member added to pending list!");
  };

  const removeFromPendingList = (index: number) => {
    setPendingMembers((prev) => prev.filter((_, i) => i !== index));
    toast.success("Member removed from pending list");
  };

  const addAllMembers = async () => {
    if (pendingMembers.length === 0) {
      toast.warning("No pending members to add");
      return;
    }

    setLoadingInvite(true);
    setInviteError(null);

    try {
      const token = getTokenFromCookies();
      if (!token) {
        throw new Error("Authentication required");
      }

      // Use teamId from prop or fallback to form.teamId
      const currentTeamId = teamId || form.teamId;
      console.log("🔍 TeamId from prop:", teamId);
      console.log("🔍 TeamId from form:", form.teamId);
      console.log("🔍 Current teamId being used:", currentTeamId);

      if (!currentTeamId) {
        throw new Error("Team ID is required to add members");
      }

      console.log("Adding members to team:", currentTeamId);

      // First, verify the team exists
      try {
        console.log("🔍 Verifying team exists...");
        const teamCheckResponse = await getApiRequest(
          `/api/teams/${currentTeamId}`,
          token
        );
        console.log("✅ Team verification response:", teamCheckResponse);
      } catch (teamCheckError) {
        console.log("❌ Team verification failed:", teamCheckError);
        throw new Error(`Team ${currentTeamId} not found or not accessible`);
      }

      // Send all pending members using the onboarding endpoint
      // const invitePromises = pendingMembers.map((member) => {
      //   const inviteUrl = `/api/teams/${currentTeamId}/invite`;
      //   const inviteData = {
      //     email: member.email,
      //     role: member.role,
      //   };

      //   console.log("📤 Sending invite to:", inviteUrl);
      //   console.log("📤 Invite data:", inviteData);

      //   return postApiRequest(inviteUrl, inviteData, {
      //     Authorization: `Bearer ${token}`,
      //   });
      // });

      // Use the onboarding endpoint instead
      const onboardingUrl = `/api/onboarding/team-tech-professional/${
        userId || "unknown"
      }/add-members`;
      const onboardingData = {
        members: pendingMembers.map((member) => ({
          techProId: member.techProId,
          role: member.role,
          status: "invited",
          invitedBy: userId || "unknown",
        })),
      };

      console.log("📤 Sending members to onboarding endpoint:", onboardingUrl);
      console.log("📤 Onboarding data:", onboardingData);

      const invitePromises = [
        postApiRequest(onboardingUrl, onboardingData, {
          Authorization: `Bearer ${token}`,
        }),
      ];

      const results = await Promise.allSettled(invitePromises);

      // Check for any failures
      const failures = results.filter((result) => result.status === "rejected");
      if (failures.length > 0) {
        console.log("❌ Some invites failed:", failures);
        failures.forEach((failure, index) => {
          console.log(`❌ Invite ${index + 1} failed:`, failure.reason);
        });
      }

      const successes = results.filter(
        (result) => result.status === "fulfilled"
      );
      console.log(
        `✅ ${successes.length} invites succeeded, ${failures.length} failed`
      );

      // On success, add all members locally to form state
      const updatedMembers = [...(form.members || []), ...pendingMembers];
      const event = {
        target: {
          name: "members",
          value: updatedMembers,
        },
      } as any;
      handleChange(event);

      // Clear pending list
      setPendingMembers([]);

      toast.success(`Successfully invited ${pendingMembers.length} members!`);
    } catch (error: any) {
      setInviteError(error.message || "Failed to send invites");
      toast.error("Failed to send some invites. Please try again.");
    } finally {
      setLoadingInvite(false);
    }
  };

  const removeMember = (index: number) => {
    const updatedMembers = form.members.filter(
      (_: any, i: number) => i !== index
    );
    const event = {
      target: {
        name: "members",
        value: updatedMembers,
      },
    } as any;
    handleChange(event);
  };

  const updateNewMember = (field: string, value: string) => {
    setNewMember((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-[10px] p-4">
        <h4 className="font-medium text-blue-900 mb-2">Add Team Members</h4>
        <p className="text-sm text-blue-800">
          Search for existing Individual Tech Professionals by their email
          address, select them, assign a role, and add them to your pending
          list. Once you've added all desired members, invite them all at once.
          Each member will receive an invitation to join your team.
        </p>
      </div>

      {/* Existing Members */}
      {form.members && form.members.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Current Team Members ({form.members.length})
          </h4>
          <div className="space-y-3">
            {form.members.map((member: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-[10px]"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="font-medium text-gray-900">
                        {member.email}
                      </p>
                    </div>
                    <div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {member.role}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeMember(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pending Members */}
      {pendingMembers.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Pending Members ({pendingMembers.length})
          </h4>
          <div className="space-y-3">
            {pendingMembers.map((member: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-[10px]"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="font-medium text-gray-900">
                        {member.fullName}
                      </p>
                      <p className="text-sm text-gray-600">{member.email}</p>
                    </div>
                    <div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {member.role}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFromPendingList(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Member */}
      <div className="border border-gray-200 rounded-[10px] p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Add New Member
        </h4>
        <div className="space-y-4">
          {/* Email Search */}
          <div className="relative search-dropdown">
            <Label
              htmlFor="newMemberEmail"
              className="text-sm font-medium text-gray-700"
            >
              Search Individual Tech Professional *
            </Label>
            <div className="flex gap-2 mt-1">
              <div className="flex-1 relative">
                <Input
                  id="newMemberEmail"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="rounded-[10px] pr-10"
                  placeholder="Type email address to search..."
                  disabled={searchingUser}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {searchingUser ? (
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                  ) : (
                    <Search className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </div>
              <Button
                type="button"
                onClick={handleSearch}
                disabled={searchingUser || searchQuery.trim().length < 2}
                className="rounded-[10px] bg-blue-600 hover:bg-blue-700 text-white px-4"
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>

            {/* Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-[10px] shadow-lg max-h-60 overflow-y-auto">
                {searchResults.map((user, index) => (
                  <div
                    key={user._id || user.id || index}
                    onClick={() => selectUser(user)}
                    className="flex items-center space-x-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.fullName || "Unknown User"}
                      </p>
                      <p className="text-xs text-gray-600 truncate flex items-center">
                        <Mail className="w-3 h-3 mr-1" />
                        {user.email}
                      </p>
                      {user.profile && (
                        <div className="flex items-center gap-2 mt-1">
                          {user.profile.currentJobTitle && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                              {user.profile.currentJobTitle}
                            </span>
                          )}
                          {user.profile.yearsOfExperience && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                              {user.profile.yearsOfExperience} years exp
                            </span>
                          )}
                          {user.isVerified && (
                            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                              Verified
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex-shrink-0">
                      <span className="text-xs text-blue-600 font-medium">
                        Click to select
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* No results message */}
            {showSearchResults &&
              searchResults.length === 0 &&
              searchQuery.length >= 2 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-[10px] shadow-lg p-3">
                  <div className="flex items-center space-x-3 text-gray-500">
                    <Search className="w-4 h-4" />
                    <span className="text-sm">
                      No professional found with email "{searchQuery}"
                    </span>
                  </div>
                </div>
              )}

            {/* Selected User Display */}
            {selectedUser && (
              <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-[10px]">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-900">
                      {selectedUser.fullName}
                    </p>
                    <p className="text-xs text-green-700">
                      {selectedUser.email}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Details (Auto-filled after selection) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="newMemberUserId"
                className="text-sm font-medium text-gray-700"
              >
                User ID
              </Label>
              <Input
                id="newMemberUserId"
                type="text"
                value={newMember.userId}
                readOnly
                className="mt-1 rounded-[10px] bg-gray-50"
                placeholder="Will be filled automatically"
              />
            </div>

            <div>
              <Label
                htmlFor="newMemberFullName"
                className="text-sm font-medium text-gray-700"
              >
                Full Name
              </Label>
              <Input
                id="newMemberFullName"
                type="text"
                value={newMember.fullName}
                readOnly
                className="mt-1 rounded-[10px] bg-gray-50"
                placeholder="Will be filled automatically"
              />
            </div>
          </div>

          {/* Role Input */}
          <div>
            <Label
              htmlFor="newMemberRole"
              className="text-sm font-medium text-gray-700"
            >
              Role *
            </Label>
            <Input
              id="newMemberRole"
              type="text"
              value={newMember.role}
              onChange={(e) => updateNewMember("role", e.target.value)}
              className="mt-1 rounded-[10px]"
              placeholder="Enter member's role (e.g., Senior Developer, Project Manager)"
            />
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="button"
              onClick={addToPendingList}
              disabled={
                !newMember.userId ||
                !newMember.email ||
                !newMember.fullName ||
                !newMember.role
              }
              className="flex items-center space-x-2 rounded-[10px] bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4" />
              <span>Add to List</span>
            </Button>

            {pendingMembers.length > 0 && (
              <Button
                type="button"
                onClick={addAllMembers}
                disabled={loadingInvite}
                className="flex items-center space-x-2 rounded-[10px] bg-green-600 hover:bg-green-700 text-white"
              >
                {loadingInvite ? (
                  <span>Inviting {pendingMembers.length} members...</span>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Add All Members ({pendingMembers.length})</span>
                  </>
                )}
              </Button>
            )}
          </div>

          {inviteError && <p className="text-sm text-red-600">{inviteError}</p>}
        </div>
      </div>

      {errors.members && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-[10px]">
          <p className="text-red-600 text-sm">{errors.members}</p>
        </div>
      )}

      <div className="bg-yellow-50 border border-yellow-200 rounded-[10px] p-4">
        <h4 className="font-medium text-yellow-900 mb-2">Important Note</h4>
        <p className="text-sm text-yellow-800">
          Team members must be existing Individual Tech Professionals on the
          platform. You can add multiple members to your pending list and invite
          them all at once. Each member will receive an invitation to join your
          team and can accept or decline the invitation.
        </p>
      </div>
    </div>
  );
}
