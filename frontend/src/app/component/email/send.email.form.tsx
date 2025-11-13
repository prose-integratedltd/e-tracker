import { useFetchSingleTemplate } from "@/hooks/queries/useFetchSingleTemplate";
import { SendEmailPayload, useSendEmail } from "@/hooks/mutations/useSendEmail";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill-new";
import PdfPreviewer from "../common/pdf.previewer";
import Image from "next/image";
import { useToast } from "@/context/ToastContext";

export const SendEmailForm = ({
	id,
	setUseTemplate,
}: {
	id: string;
	setUseTemplate: (useTemplate: boolean) => void;
}) => {
	const { showToast } = useToast();

	const {
		mutate: sendEmail,
		isPending: isSending,
		error,
		isSuccess,
	} = useSendEmail();
	const { data, isLoading } = useFetchSingleTemplate(id);
	const [formData, setFormData] = useState<SendEmailPayload>({
		to: "",
		subject: data?.subject ?? "",
		htmlBody: data?.body ?? "",
		attachments: data?.attachments ?? [],
	});

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>
	) => {
		const { name, value } = e.target;

		setFormData((prev) => ({ ...prev, [name]: value }));
		// setDisable(false);
	};

	const handleBodyChange = (value: string) => {
		setFormData((prev) => ({ ...prev, body: value }));
		// setDisable(false);
	};

	const onSendEmail = () => sendEmail(formData);

	useEffect(() => {
		if (error) showToast(error.message, "error");

		return () => {};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [error]);

	useEffect(() => {
		if (isSuccess) showToast("Email send successfully", "success");

		return () => {};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isSuccess]);

	useEffect(() => {
		if (!data) return;

		setFormData({
			to: "",
			subject: data?.subject,
			htmlBody: data?.body,
			attachments: data?.attachments,
		});
	}, [data]);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<div className="sm:flex items-center justify-between w-full px-4 py-3 ">
				<div
					className="flex items-center gap-4 cursor-pointer"
					onClick={() => setUseTemplate(false)}
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
						className="w-[164px] h-11 rounded-[10px] border border-[#CCCCCC] text-white bg-[#1E1E1E]"
						onClick={isSending ? () => {} : onSendEmail}
					>
						{isSending ? "Sending" : "Send"}
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
							To
						</label>
						<div className="sm:w-[400px] h-[54px] border border-[#CCCCCC] rounded-[10px]">
							<input
								type="email"
								className="w-full h-full bg-transparent outline-none text-sm p-4 text-[#1D1D1D]"
								placeholder="Email Address"
								name="to"
								onChange={handleChange}
							/>
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
								name="subject"
								defaultValue={formData.subject}
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
								value={formData.htmlBody}
								onChange={handleBodyChange}
								// modules={{
								// 	toolbar: toolbarOptions,
								// }}
								placeholder="Write something..."
								className="w-full bg-transparent text-sm text-[#1D1D1D]"
							/>
						</div>
					</div>
				</div>

				{data?.type === "Email" && data?.attachments?.length > 0 && (
					<div>
						{data?.attachments?.map((att) => {
							const url = `${process.env.NEXT_PUBLIC_API_URL}${att.filename}`;

							if (att.mimetype == "application/pdf") {
								return (
									<div key={url} className="mt-5">
										<PdfPreviewer
											key={url}
											file={{ url }}
										/>
									</div>
								);
							}

							return (
								<div key={url} className="mt-5">
									<Image src={url} alt={att.filename} />
								</div>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
};
