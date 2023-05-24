import { useSearchParams, useActionData, Link } from "@remix-run/react";
import { useRef } from "react";
import { Sign } from "~/features/Auth/components/Sign";
import type { User } from "@prisma/client";
import type { LoaderArgs, ActionArgs } from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import { getUserId, createUserSession } from "~/session.server";
import { safeRedirect, validateEmail } from "~/utils";

export const loader = async ({ request }: LoaderArgs) => {
    const userId = await getUserId(request);

    if (userId) return redirect("/");

    return json({});
}

export const action = async ({ request }: ActionArgs) => {
    const formData = await request.formData();
    const email = formData.get("email");
    const password = formData.get("password");
    const redirectTo = safeRedirect(formData.get("redirectTo"), "/");
    const remember = formData.get("remember");

    if (!validateEmail(email)) {
        return json(
            { errors: { email: "Email is invalid", password: null } },
            { status: 400 }
        );
    }

    if (typeof password !== "string" || password.length === 0) {
        return json(
            { errors: { email: null, password: "Password is required" } },
            { status: 400 }
        );
    }

    if (password.length < 8) {
        return json(
            { errors: { email: null, password: "Password is too short" } },
            { status: 400 }
        );
    }

    // Call database to fetch User
    const user = {} as User;
    //const user = await verifyLogin(email, password);

    if (!user) {
        return json(
            { errors: { email: "Invalid email or password", password: null } },
            { status: 400 }
        );
    }

    return createUserSession({
        redirectTo,
        remember: remember === "on" ? true : false,
        request,
        userId: user.id,
    });
}

export default function () {
    const [searchParams] = useSearchParams();
    const redirectTo = searchParams.get("redirectTo") || "/";
    const actionData = useActionData<typeof action>();
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    return (
        <Sign shouldInvert={false} >
            <div>
                <h2 className="text-2xl font-bold text-blue-700">SignUp</h2>
                <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                >
                    Email address
                </label>
                <div className="mt-1">
                    <input
                        ref={emailRef}
                        id="email"
                        required
                        autoFocus={true}
                        name="email"
                        type="email"
                        autoComplete="email"
                        aria-invalid={actionData?.errors?.email ? true : undefined}
                        aria-describedby="email-error"
                        className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
                    />
                    {actionData?.errors?.email ? (
                        <div className="pt-1 text-red-700" id="email-error">
                            {actionData.errors.email}
                        </div>
                    ) : null}
                </div>
            </div>

            <div>
                <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                >
                    Password
                </label>
                <div className="mt-1">
                    <input
                        id="password"
                        ref={passwordRef}
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        aria-invalid={actionData?.errors?.password ? true : undefined}
                        aria-describedby="password-error"
                        className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
                    />
                    {actionData?.errors?.password ? (
                        <div className="pt-1 text-red-700" id="password-error">
                            {actionData.errors.password}
                        </div>
                    ) : null}
                </div>
            </div>

            <input type="hidden" name="redirectTo" value={redirectTo} />
            <button
                type="submit"
                className="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
            >
                Log in
            </button>
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <input
                        id="remember"
                        name="remember"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label
                        htmlFor="remember"
                        className="ml-2 block text-sm text-gray-900"
                    >
                        Remember me
                    </label>
                </div>
                <div className="text-center text-sm text-gray-500">
                    Already have an account?{" "}
                    <Link
                        className="text-blue-500 underline"
                        to={{
                            pathname: "/login",
                            search: searchParams.toString(),
                        }}
                    >
                        Login
                    </Link>
                </div>
            </div>
        </Sign>
    );
}