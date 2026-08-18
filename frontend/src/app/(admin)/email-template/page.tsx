"use client";

import MailTemplateTable from "@/app/component/common/tables/MailTemplateTable";
import DashboardHead from "@/app/component/dashboard/DashboardHead";
import AddTemplate from "@/app/component/dashboard/mail-template/AddTemplate";
import React, { useState } from "react";

const EmailTemplate = () => {
	const [showAddTemplate, setShowAddTemplate] = useState<boolean>(false);

	return (
		<>
			<div className="hidden sm:block">
				<DashboardHead name="Email/SMS Template" />
			</div>
			<div className="sm:hidden block">
				<DashboardHead name="Email Template" />
			</div>
			{!showAddTemplate && (
				<MailTemplateTable setShowAddTemplate={setShowAddTemplate} />
			)}
			{showAddTemplate && (
				<AddTemplate setShowAddTemplate={setShowAddTemplate} />
			)}
		</>
	);
};

export default EmailTemplate;
