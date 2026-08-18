"use client";

import Image from "next/image";
import AuthInput from "../auth/component/auth.input";
import UserIcon from "../component/icons/user.icon";
import LockIcon from "../component/icons/lock.icon";
import EyeIcon from "../component/icons/eye.icon";
import React, { useEffect, useState } from "react";
import { useLogin } from "@/hooks/mutations/useLogin";
import { useToast } from "@/context/ToastContext";
import { useRouter } from "next/navigation";
import { FaRegEyeSlash } from "react-icons/fa";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";

type CustomError = {
	response?: {
		data?: {
			message?: string;
		};
	};
};

const Login = () => {
	const [isFormValid, setIsFormValid] = useState<boolean>(false);
	const [passwordType, setPasswordType] = useState<string>("password");
	const [isError, setIsError] = useState<boolean>(false);
	const { mutate, isPending } = useLogin();
	const queryClient = useQueryClient();
	// const search = useSearchParams();
	const router = useRouter();

	const { showToast } = useToast();

	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	useEffect(() => {
		const areAllFieldsFilled = !!(
			formData.email.trim() && formData.password.trim()
		);
		setIsFormValid(areAllFieldsFilled);
	}, [formData]);

	const isCustomError = (error: unknown): error is CustomError => {
		return (
			typeof error === "object" &&
			error !== null &&
			"response" in error &&
			typeof (error as CustomError).response === "object"
		);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		mutate(formData, {
			onSuccess: () => {
				// const redirect = search.get("redirect");

				showToast("User Logged in Successfully", "success");
				queryClient.invalidateQueries({ queryKey: ["auth-user"] });

				// if (redirect) return router.replace(redirect);

				setIsError(false);

				return router.replace("/dashboard");
			},
			onError: (error: unknown) => {
				if (isCustomError(error)) {
					const message =
						error.response?.data?.message || "Failed to login";
					showToast(message, "error");
					setIsError(true);
				} else {
					console.error("Unexpected error:", error);
					showToast("An unexpected error occurred", "error");
					setIsError(true);
				}

				setTimeout(() => {
					setIsError(false);
				}, 3000);
			},
		});
	};

	return (
		<div className="flex flex-col md:flex-row md:h-[100vh] p-4 md:p-8 mt-12 md:mt-0">
			<div className="hidden md:block md:flex-1 p-8 bg-[url('/backgrounds/auth.png')] bg-center bg-no-repeat rounded-2xl"></div>

			<div className="md:flex-1 md:p-8 flex flex-col justify-center items-center">
				<div className="mx-auto w-full md:w-[70%] md:h-full md:justify-center flex flex-col gap-5">
					<div className="flex items-center justify-center">
						<Image
							src="/logos/logo.png"
							alt="logo"
							width={150}
							height={40}
						/>
					</div>

					<h1 className="md:text-[60px] text-3xl md:mb-5 md:mt-6 mb-2 mt-4">
						Login
					</h1>

					<form
						className="flex flex-col gap-4"
						onSubmit={handleSubmit}
					>
						<AuthInput
							prefix={<UserIcon />}
							placeholder="Username or email address"
							type="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							isError={isError}
							required
						/>

						<AuthInput
							prefix={<LockIcon />}
							suffix={
								passwordType === "password" ? (
									<EyeIcon
										className="hover:cursor-pointer"
										onClick={() => {
											setPasswordType("text");
										}}
									/>
								) : (
									<FaRegEyeSlash
										className="hover:cursor-pointer text-2xl font-medium"
										onClick={() => {
											setPasswordType("password");
										}}
									/>
								)
							}
							name="password"
							type={passwordType}
							placeholder="Password"
							value={formData.password}
							onChange={handleChange}
							isError={isError}
							required
						/>

						<div className="flex items-center justify-between mt-2 mb-4">
							<div className="flex items-center gap-2">
								<input
									type="checkbox"
									className="default:ring-2 required:border-red-500"
								/>
								<span className="text-[#3D3D3D]">
									Remember Me
								</span>
							</div>

							<Link
								href="/forgot-password"
								className="text-[#3D3D3D]"
							>
								Forgot Password?
							</Link>
						</div>

						<button
							className="bg-[#40347F] text-white py-4 px-4 rounded-[10px] disabled:bg-opacity-15"
							type="submit"
							disabled={!isFormValid || isPending}
						>
							{isPending ? "Loading..." : "Sign In"}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Login;
