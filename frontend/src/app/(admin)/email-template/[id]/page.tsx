"use client";

import TemplateDeleteModal from "@/app/component/common/modals/TemplateDeleteModal";
import { SendEmailForm } from "@/app/component/email/send.email.form";
import { useToast } from "@/context/ToastContext";
import { useDeleteTemplate } from "@/hooks/mutations/useDeleteTemplate";
import { useUpdateTemplate } from "@/hooks/mutations/useUpdateTemplate";
import { useFetchSingleTemplate } from "@/hooks/queries/useFetchSingleTemplate";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
interface FormData {
	title: string;
	subject: string;
	type: string;
	body: string;
}

type CustomError = {
	response?: {
		data?: {
			message?: string;
		};
	};
};

const TemplateRecord = () => {
	const [useTemplate, setUseTemplate] = useState(false);
	const [showModal, setShowModal] = useState<boolean>(false);
	const router = useRouter();
	const { id: pageId } = useParams<{ id: string }>();

	const { showToast } = useToast();
	const { data, isLoading } = useFetchSingleTemplate(pageId);
	const { mutate, isPending } = useDeleteTemplate();
	const [disable, setDisable] = useState<boolean>(true);
	const [formData, setFormData] = useState<FormData>({
		title: "",
		subject: "",
		type: "",
		body: "",
	});

	useEffect(() => {
		if (data) {
			setFormData({
				title: data.title,
				subject: data.subject,
				type: data.type,
				body: data.body,
			});
		}
	}, [data]);

	const { mutate: updateTemplate, isPending: isUpdatingTemplate } =
		useUpdateTemplate();

	const isCustomError = (error: unknown): error is CustomError => {
		return (
			typeof error === "object" &&
			error !== null &&
			"response" in error &&
			typeof (error as CustomError).response === "object"
		);
	};

	const handleDelete = () => {
		mutate(pageId, {
			onSuccess: () => {
				showToast("Template Deleted Successfully", "success");
				router.push("/email-template");
			},
			onError: (error: unknown) => {
				if (isCustomError(error)) {
					const message =
						error.response?.data?.message ||
						"Error deleting template";
					console.error("Failed to delete template:", error);
					showToast(message, "error");
				} else {
					console.error("Unexpected error:", error);
					showToast("An unexpected error occurred", "error");
				}
			},
		});
	};

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>
	) => {
		const { name, value } = e.target;

		setFormData((prev) => ({ ...prev, [name]: value }));
		setDisable(false);
	};

	const toolbarOptions = [
		[{ header: [1, 2, 3, false] }],
		["bold", "italic", "underline", "strike"],
		[{ list: "ordered" }, { list: "bullet" }, { align: [] }],
		["image", "link", "blockquote", "code-block"],
		["clean"],
	];

	const handleBodyChange = (value: string) => {
		setFormData((prev) => ({ ...prev, body: value }));
		setDisable(false);
	};

	const handleUpdate = () => {
		updateTemplate(
			{
				id: pageId,
				data: formData,
			},
			{
				onSuccess: () => {
					showToast("Template Updated Successfully", "success");
				},
				onError: (error: unknown) => {
					if (isCustomError(error)) {
						const message =
							error.response?.data?.message ||
							"Error updating template";
						console.error("Failed to update template:", error);
						showToast(message, "error");
					} else {
						console.error("Unexpected error:", error);
						showToast("An unexpected error occurred", "error");
					}
				},
			}
		);
	};

	if (useTemplate)
		return <SendEmailForm id={pageId} setUseTemplate={setUseTemplate} />;

	return (
		<>
			{isLoading ? (
				<div className="flex items-center justify-center w-full h-full text-xl">
					{/* <ReactLoading type="bars" color="#000" /> */}
					Loading...
				</div>
			) : (
				<div>
					<div className="sm:flex items-center justify-between w-full px-4 py-3 ">
						<div
							className="flex items-center gap-4 cursor-pointer"
							onClick={() => {
								router.push(`/email-template`);
							}}
						>
							<svg
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M19 12L5 12M5 12L12 19M5 12L12 5"
									stroke="#1D1D1D"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
							<span className="text-[#1D1D1D] font-semibold text-lg">
								{data?.title}
							</span>
						</div>

						<div className="flex items-center gap-3 justify-between sm:justify-start mt-3 sm:mt-0">
							<button
								className="w-[104px] h-11 rounded-[10px] text-white bg-[#1E1E1E] disabled:bg-[#F4F4F4] disabled:text-[#3D3D3D] disabled:pointer-events-none"
								onClick={handleUpdate}
								disabled={disable || isUpdatingTemplate}
							>
								{isUpdatingTemplate ? "Loading..." : "Save"}
							</button>
							<button
								type="button"
								className="w-[141px] h-[54px] rounded-[10px] bg-[#FFDFDF] font-medium text-[#FF3030]"
								onClick={() => setShowModal(true)}
							>
								Delete
							</button>
							<button
								className="w-[164px] h-11 rounded-[10px] border border-[#CCCCCC] text-white bg-[#1E1E1E]"
								onClick={() => setUseTemplate(true)}
							>
								Use Template
							</button>
						</div>
					</div>

					<div className="bg-white px-4 sm:px-10 pt-4 pb-96">
						<div>
							<div className="flex flex-col gap-2 mt-3">
								<label
									htmlFor="Template Title"
									className="text-[#6C757D] font-medium text-sm"
								>
									Template Title
								</label>
								<div className="sm:w-[400px] h-[54px] border border-[#CCCCCC] rounded-[10px]">
									<input
										type="text"
										className="w-full h-full bg-transparent outline-none text-sm p-4 text-[#1D1D1D]"
										placeholder="Package Tracking Details"
										name="title"
										value={formData.title}
										onChange={handleChange}
									/>
								</div>
							</div>

							<div className="flex flex-col gap-2 mt-5">
								<label
									htmlFor="Template Type"
									className="text-[#6C757D] font-medium text-sm"
								>
									Template Type
								</label>
								<div className="sm:w-[400px] h-[54px] border border-[#CCCCCC] rounded-[10px] ">
									<select
										name="type"
										value={formData.type}
										className="w-full h-full bg-transparent outline-none text-sm px-4 mr-4 text-[#1D1D1D]"
										onChange={handleChange}
									>
										<option value="">
											Select Template Type
										</option>
										<option value="Email">Email</option>
										<option value="SMS">SMS</option>
									</select>
								</div>
							</div>

							<div className="flex flex-col gap-2 mt-5">
								<label
									htmlFor="Subject"
									className="text-[#6C757D] font-medium text-sm"
								>
									Subject
								</label>
								<div className="sm:w-[700px] h-[54px] border border-[#CCCCCC] rounded-[10px]">
									<input
										type="text"
										className="w-full h-full bg-transparent outline-none text-sm p-4 text-[#1D1D1D]"
										placeholder=""
										name="subject"
										value={formData.subject}
										onChange={handleChange}
									/>
								</div>
							</div>

							<div className="flex flex-col gap-2 mt-5">
								<label
									htmlFor="Template Body"
									className="text-[#6C757D] font-medium text-sm"
								>
									Body
								</label>
								<div className="sm:w-[700px] h-auto border border-[#CCCCCC] rounded-[10px]">
									<ReactQuill
										theme="snow"
										value={formData.body}
										onChange={handleBodyChange}
										modules={{
											toolbar: toolbarOptions,
										}}
										placeholder="Write something..."
										className="w-full bg-transparent text-sm text-[#1D1D1D]"
									/>
								</div>
							</div>
						</div>

						{formData?.type === "Email" && (
							<button className="w-full sm:w-[183px] h-[54px] rounded-[10px] text-sm bg-[#EFEFEF] text-[#1E1E1E] disabled:pointer-events-none mt-10 flex items-center justify-center gap-2">
								<svg
									width="20"
									height="20"
									viewBox="0 0 20 20"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M17.6261 9.08296L10.1131 16.596C8.40458 18.3045 5.63448 18.3045 3.92594 16.596C2.2174 14.8874 2.2174 12.1173 3.92594 10.4088L11.4389 2.89578C12.578 1.75675 14.4247 1.75675 15.5637 2.89578C16.7028 4.0348 16.7028 5.88154 15.5637 7.02057L8.34536 14.2389C7.77584 14.8085 6.85248 14.8085 6.28296 14.2389C5.71345 13.6694 5.71345 12.7461 6.28296 12.1766L12.6175 5.84205"
										stroke="black"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
								Add Attachments
							</button>
						)}
					</div>
				</div>
			)}

			{showModal && (
				<TemplateDeleteModal
					setShowModal={setShowModal}
					handleDelete={handleDelete}
					isPending={isPending}
				/>
			)}
		</>
	);
};

export default TemplateRecord;
