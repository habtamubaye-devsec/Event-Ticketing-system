import { useEffect, useState } from "react";
import PageTitle from "../../../components/pageTitle";
import type { UserType } from "../../../interface";
import { Button, Form, Input, message } from "antd";
import { getCurrentUser, updateUserData } from "../../../api-services/users-service";
import { getDateTimeFormat } from "../../../helper";

function getErrorMessage(error: unknown): string {
  if (typeof error === "string") return error;
  if (error && typeof error === "object") {
    const maybe = error as {
      message?: unknown;
      response?: { data?: { message?: unknown } };
    };
    const respMsg = maybe.response?.data?.message;
    if (typeof respMsg === "string" && respMsg) return respMsg;
    if (typeof maybe.message === "string" && maybe.message) return maybe.message;
  }
  return "Something went wrong";
}

function ProfilePage() {
  const [user, setUser] = useState<UserType | null>(null);
  const [editValue, setEditValue] = useState(false);
  const [userData, setUserData] = useState<Partial<UserType>>({});
  const profileFields = [
    { key: "id", label: "User Id", value: user?._id },
    { key: "name", label: "Name", value: user?.name },
    { key: "email", label: "Email", value: user?.email },
    { key: "role", label: "Role", value: user?.isAdmin ? "Administrator" : "Member" },
  ];
  const joinedDate = user?.createdAt ? getDateTimeFormat(user.createdAt) : "—";
  const daysActive = user?.createdAt
    ? Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))
    : null;
  const roleLabel = user?.isAdmin ? "Administrator" : "Event Member";
  const badgeClass = user?.isAdmin
    ? "bg-gradient-to-r from-[var(--primary)] to-[var(--primary-2)] text-white"
    : "border border-[var(--primary)] text-[var(--primary)]";

  const getUser = async () => {
    try {
      const response = await getCurrentUser();
      setUser(response.data);
    } catch (error: unknown) {
      message.error(getErrorMessage(error));
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const renderUserProperty = (label: string, value: unknown) => (
    <div className="flex flex-col text-sm gap-1">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="text-[var(--text)] font-semibold break-words">{value}</span>
    </div>
  );

  const handleSubmit = async () => {
    try {
      if (!user?._id) return;
      console.log(user?._id)
      await updateUserData(user._id, userData);
      message.success("User updated successfully");
      setEditValue(false);
      getUser();
    } catch {
      message.error("Failed to update user information");
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* View Mode */}
      <div className={`${editValue ? "hidden" : "grid"}`}>
        <div className="q-card overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] px-6 py-5">
            <div>
              <PageTitle title="Profile" />
              <p className="text-sm text-[var(--muted)] max-w-3xl">
                Manage the personal details that show up across the dashboard and event booking experience.
              </p>
            </div>
            <Button
              type="primary"
              className="rounded-full px-5 py-2 text-sm"
              onClick={() => {
                setUserData(user || {});
                setEditValue(true);
              }}
            >
              Edit Profile
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-6 px-6 py-6 lg:grid-cols-[3fr,2fr]">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-5 shadow-[0_24px_45px_rgba(15,23,42,0.08)]">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs tracking-[0.4em] uppercase text-[var(--muted)]">Account snapshot</p>
                <span className={`rounded-full px-3 py-1 text-xs tracking-[0.35em] uppercase ${badgeClass}`}>
                  {roleLabel}
                </span>
              </div>
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {profileFields.map((item) => (
                  <div key={item.key} className="flex flex-col gap-1">
                    <span className="text-[var(--muted)] text-[0.65rem] uppercase tracking-[0.35em]">
                      {item.label}
                    </span>
                    <span className="text-sm font-semibold text-[var(--text)] break-all">
                      {item.value ?? "—"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-gradient-to-br from-[var(--surface-2)] to-[var(--surface)] p-6 text-[var(--text)] shadow-[0_24px_45px_rgba(15,23,42,0.15)]">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Membership</p>
              <p className="text-2xl font-black tracking-tight mt-2">{joinedDate}</p>
              <p className="text-sm mt-2 text-[var(--text)]/70">
                {daysActive ? `${daysActive} days active` : "Session data pending"}
              </p>
              <div className="mt-6 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Status</p>
                  <p className="font-bold text-lg">{user?.isAdmin ? "Admin mode" : "Standard access"}</p>
                </div>
                <Button type="text" className="text-sm text-[var(--primary)]" onClick={() => setEditValue(true)}>
                  Update
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Mode */}
      <div className={`${editValue ? "grid" : "hidden"}`}>
        <div className="q-card lg:w-3/4 lg:m-auto overflow-hidden border border-[var(--border)] bg-gradient-to-br from-[var(--surface)] to-[var(--surface-2)] shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] px-6 py-5">
            <div>
              <PageTitle title="Edit Profile" />
              <p className="text-sm text-[var(--muted)]">Update your personal details to keep them in sync.</p>
            </div>
          </div>

          <div className="px-6 py-6">
            <Form
              layout="vertical"
              className="grid grid-cols-1 gap-5 md:grid-cols-2"
            >
              <Form.Item label="Name">
                <Input
                  placeholder="Name"
                  value={userData.name}
                  onChange={(e) =>
                    setUserData({ ...userData, name: e.target.value })
                  }
                  className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)]"
                />
              </Form.Item>

              <Form.Item label="Email">
                <Input
                  placeholder="Email"
                  value={userData.email}
                  onChange={(e) =>
                    setUserData({ ...userData, email: e.target.value })
                  }
                  className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)]"
                />
              </Form.Item>
            </Form>
            <p className="text-xs text-[var(--muted)] mt-4">
              Changes are saved immediately across the dashboard once you hit Save.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
              <Button className="rounded-full px-5 py-2" onClick={() => setEditValue(false)}>
                Cancel
              </Button>
              <Button type="primary" className="rounded-full px-6 py-2" onClick={() => handleSubmit()}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
