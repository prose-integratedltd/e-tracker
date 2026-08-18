"use client";

import DashboardHead from "@/app/component/dashboard/DashboardHead";
import UserSettings from "@/app/component/settings/UserSettings";
import React from "react";

const Settings = () => {
	return (
		<>
			<DashboardHead name="Settings" />
			<UserSettings />
		</>
	);
};

export default Settings;
