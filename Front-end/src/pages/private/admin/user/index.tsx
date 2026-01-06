import { useEffect, useState } from "react";
import PageTitle from "../../../../components/pageTitle";
import type { UserType } from "../../../../interface";
import { message, Select, Table } from "antd";
import {
  getAllUser,
  updateUserData,
} from "../../../../api-services/users-service";
import { getDateTimeFormat } from "../../../../helper";

type UpdateUserRolePayload = {
  userId: string;
  isAdmin: boolean;
};

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

function UsersPage() {
  const [user, setUser] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    try {
      setLoading(true);
      const response = await getAllUser();
      setUser(response.data);
    } catch (error: unknown) {
      message.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (data: UpdateUserRolePayload) => {
    try {
      setLoading(true);
      await updateUserData(data);
      message.success("User Updated Successfully");
      await getData();
    } catch (error: unknown) {
      message.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "user",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Joined At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt: string) => getDateTimeFormat(createdAt),
      responsive: ["md"],
    },

    {
      title: "Role",
      dataIndex: "isAdmin",
      key: "isAdmin",
      render: (isAdmin: boolean, row: UserType) => {
        return (
          <Select
            value={isAdmin ? "admin" : "user"}
            size="small"
            style={{ minWidth: 110 }}
            options={[
              { value: "user", label: "User" },
              { value: "admin", label: "Admin" },
            ]}
            onChange={(value) => {
              const isAdminUpdated = value === "admin";
              updateUser({ userId: row._id, isAdmin: isAdminUpdated });
            }}
          />
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageTitle title="Users" />

      <div className="q-card">
        <Table
          dataSource={user}
          columns={columns}
          loading={loading}
          rowKey="_id"
        />
      </div>
    </div>
  );
}

export default UsersPage;
