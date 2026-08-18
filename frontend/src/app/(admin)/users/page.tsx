"use client";

import UsersTable from "@/app/component/common/tables/UsersTable";
import DashboardHead from "@/app/component/dashboard/DashboardHead";
import CreateUser from "@/app/component/users/CreateUser";
import React, { useState } from "react";

const Users = () => {
    const [showCreateUser, setShowCreateUser] = useState<boolean>(false);
    
	return (
    <div className="w-full h-screen overflow-y-auto">
      <DashboardHead name="Users" />
      {!showCreateUser && <UsersTable setShowCreateUser={setShowCreateUser} />}
      {showCreateUser && <CreateUser setShowCreateUser={setShowCreateUser} />}
    </div>
  );
};

export default Users;
