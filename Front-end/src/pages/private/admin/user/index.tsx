import { useEffect, useState } from "react";
import PageTitle from "../../../../components/pageTitle";
import type { UserType } from "../../../../interface";
import { message, Table } from "antd";
import {
  getAllUser,
  updateUserData,
} from "../../../../api-services/users-service";
import { getDateTimeFormat } from "../../../../helper";

function UsersPage() {
  const [user, setUser] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    try {
      setLoading(true);
      const response = await getAllUser();
      setUser(response.data);
    } catch (error: any) {
      message.error(error.response.data.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (data: any) => {
    try {
      setLoading(true);
      await updateUserData(data);
      message.success("User Updated Successfully");
      await getData();
    } catch (error: any) {
      message.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
      key: "id",
    },
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
    },

    {
      title: "Role",
      dataIndex: "isAdmin",
      key: "isAdmin",
      render: (isAdmin: boolean, row: UserType) => {
        return (
          <select
            value={isAdmin ? "admin" : "user"}
            className=" border border-solid border-gray-600 rounded p-1"
            onChange={(e) => {
              const isAdminUpdated = e.target.value === "admin";
              updateUser({ userId: row._id, isAdmin: isAdminUpdated });
            }}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        );
      },
    },
  ];

  return (
    <div>
      <PageTitle title="Users" />
      <Table
        dataSource={user}
        columns={columns}
        loading={loading}
        rowKey="_id"
      />
    </div>
  );
}

export default UsersPage;
