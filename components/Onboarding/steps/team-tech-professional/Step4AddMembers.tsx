"use client";

import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X, Plus, Search, User, Loader2, Mail } from "lucide-react";
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
}

const roles = [
  "developer",
  "designer",
  "project_manager",
  "qa_tester",
  "devops_engineer",
  "data_scientist",
  "ui_ux_designer",
  "frontend_developer",
  "backend_developer",
  "full_stack_developer",
  "mobile_developer",
  "other",
];

export function Step4AddMembers({
  form,
  errors,
  handleChange,
  teamId,
}: Step4AddMembersProps) {
  // Debug: Log the teamId to ensure it's being passed correctly
  console.log("Step4AddMembers - teamId:", teamId);
  console.log("Step4AddMembers - form.teamId:", form.teamId);
  const [newMember, setNewMember] = useState({
    userId: "",
    fullName: "",
    email: "",
    role: "",
    teamId: "",
  });

  const [pendingMembers, setPendingMembers] = useState<any[]>([]);
  const [loadingInvite, setLoadingInvite] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [searchingUser, setSearchingUser] = useState(false);
  const [userFound, setUserFound] = useState(false);

  // Live search states
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Live search function using the single endpoint
  const performLiveSearch = async (query: string) => {
    if (!query || query.length < 3) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setSearchingUser(true);
    setInviteError(null);

    try {
      const token = getTokenFromCookies();
      if (!token) {
        throw new Error("Authentication required");
      }

      // Try to search with the exact email first
      const response = await getApiRequest(
        `/api/users/individual-tech-professional/email/${encodeURIComponent(
          query
        )}`,
        token
      );

      if (response.status < 400) {
        const userData = response.data?.data;
        if (userData) {
          // If we found a user, show it as a single result
          setSearchResults([userData]);
          setShowSearchResults(true);
        } else {
          setSearchResults([]);
          setShowSearchResults(false);
        }
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    } catch (error: any) {
      setSearchResults([]);
      setShowSearchResults(false);
      // Don't show error for live search, just clear results
    } finally {
      setSearchingUser(false);
    }
  };

  // Debounced search effect
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.length >= 3) {
      searchTimeoutRef.current = setTimeout(() => {
        performLiveSearch(searchQuery);
      }, 500); // 500ms debounce for live search
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  // Click outside handler to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle search input change
  const handleSearchInputChange = (value: string) => {
    setSearchQuery(value);
    setNewMember((prev) => ({ ...prev, email: value }));
    setUserFound(false);
    setInviteError(null);
  };

  // Select user from search results
  const selectUser = (user: any) => {
    setNewMember((prev) => ({
      ...prev,
      userId: user._id || user.id || "",
      fullName: user.fullName || "",
      email: user.email || "",
    }));
    setUserFound(true);
    setShowSearchResults(false);
    setSearchQuery(user.email || "");
    toast.success("User selected successfully!");
  };

  const searchUserByEmail = async (email: string) => {
    if (!email || !email.includes("@")) {
      setUserFound(false);
      return;
    }

    setSearchingUser(true);
    setInviteError(null);

    try {
      const token = getTokenFromCookies();
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await getApiRequest(
        `/api/users/individual-tech-professional/email/${encodeURIComponent(
          email
        )}`,
        token
      );

      if (response.status >= 400) {
        throw new Error("User not found");
      }

      const userData = response.data?.data;
      if (userData) {
        setNewMember((prev) => ({
          ...prev,
          userId: userData._id || userData.id || "",
          fullName: userData.fullName || "",
          email: userData.email || email,
        }));
        setUserFound(true);
        toast.success("User found successfully!");
      } else {
        setUserFound(false);
        toast.warning("User not found with this email");
      }
    } catch (error: any) {
      setUserFound(false);
      setInviteError(error.message || "Failed to search user");
      toast.error("User not found with this email");
    } finally {
      setSearchingUser(false);
    }
  };

  const addToPendingList = () => {
    if (!newMember.fullName || !newMember.email || !newMember.role) {
      toast.error("Please fill in all required fields");
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
      fullName: "",
      email: "",
      role: "",
      teamId: "",
    });
    setUserFound(false);
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
      if (!currentTeamId) {
        throw new Error("Team ID is required to add members");
      }

      console.log("Adding members to team:", currentTeamId);

      // Send all pending members
      const invitePromises = pendingMembers.map((member) =>
        postApiRequest(
          `/api/teams/${currentTeamId}/invite`,
          {
            email: member.email,
            role: member.role,
            userId: member.userId,
            fullName: member.fullName,
          },
          {
            Authorization: `Bearer ${token}`,
          }
        )
      );

      await Promise.all(invitePromises);

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
          Add existing Individual Tech Professionals from the platform to your
          team. Search for members by their email address, add them to your
          pending list, then invite all members at once. Each member will
          receive an invitation to join your team.
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
                        {member.fullName}
                      </p>
                      <p className="text-sm text-gray-600">{member.email}</p>
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
          {/* Live Email Search */}
          <div className="relative">
            <Label
              htmlFor="newMemberEmail"
              className="text-sm font-medium text-gray-700"
            >
              Search by Email * (Live Search)
            </Label>
            <div className="flex gap-2 mt-1">
              <div className="flex-1 relative">
                <Input
                  ref={searchInputRef}
                  id="newMemberEmail"
                  type="email"
                  value={searchQuery}
                  onChange={(e) => handleSearchInputChange(e.target.value)}
                  onFocus={() => {
                    if (searchResults.length > 0) {
                      setShowSearchResults(true);
                    }
                  }}
                  className="flex-1 rounded-[10px] pr-10"
                  placeholder="Type email address to search live..."
                />
                {searchingUser && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                  </div>
                )}
                {!searchingUser && searchQuery && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Search className="w-4 h-4 text-gray-400" />
                  </div>
                )}
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => searchUserByEmail(searchQuery)}
                disabled={
                  !searchQuery || !searchQuery.includes("@") || searchingUser
                }
                className="rounded-[10px]"
              >
                {searchingUser ? "Searching..." : "Manual Search"}
              </Button>
            </div>

            {/* Live Search Results Dropdown */}
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
              searchQuery.length >= 3 &&
              !searchingUser && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-[10px] shadow-lg p-3">
                  <div className="flex items-center space-x-3 text-gray-500">
                    <Search className="w-4 h-4" />
                    <span className="text-sm">
                      No users found for "{searchQuery}"
                    </span>
                  </div>
                </div>
              )}

            {userFound && (
              <p className="mt-1 text-sm text-green-600">
                ✓ User found successfully!
              </p>
            )}
          </div>

          {/* User Details (Auto-filled after search) */}
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
                !newMember.fullName ||
                !newMember.email ||
                !newMember.role ||
                !userFound
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

          {!userFound && newMember.email && (
            <p className="text-sm text-amber-600">
              ⚠️ Please search for the user first before adding to the list
            </p>
          )}

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
