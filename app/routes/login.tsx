import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, isRouteErrorResponse, useActionData, useRouteError, useSearchParams } from "@remix-run/react";
import { Sign } from "~/features/Auth/components/Sign";
import { createUserSession, getUserId } from "~/session.server";
import { safeRedirect, validateEmail } from "~/utils";
import { motion } from "framer-motion";
import { Input } from "~/components/Input";
import { login } from "~/features/Auth/auth.api";
import { LoginError } from "~/lib/errors/LoginError";


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

  const user = await login({ email, password });

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

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";
  const actionData = useActionData<typeof action>();

  return (
    <div className="bg-gray-900">
      <motion.div
        key="loginAnimation"
      // initial={{ x: "50%" }}
      // animate={{ x: "0%" }}
      // exit={{ x: "-100%" }}
      // transition={{ duration: .5, ease: 'easeIn' }}
      >
        <Sign>
          <Form method="post" className="space-y-6">
            <div>
              <div className="mt-1">
                <Input
                  label="email"
                  id="email"
                  // required
                  autoFocus={true}
                  name="email"
                  type="email"
                  autoComplete="email"
                  aria-invalid={actionData?.errors?.email ? true : undefined}
                  aria-describedby="email-error"
                />
                {actionData?.errors?.email ? (
                  <div className="pt-1 text-red-700" id="email-error">
                    {actionData.errors.email}
                  </div>
                ) : null}
              </div>
            </div>

            <div>
              <div className="mt-1">
                <Input
                  label="password"
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  aria-invalid={actionData?.errors?.password ? true : undefined}
                  aria-describedby="password-error"
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
                  className="ml-2 block text-sm text-gray-200"
                >
                  Remember me
                </label>
              </div>
              <div className="text-center text-sm text-gray-500">
                Don't have an account?{" "}
                <Link
                  className="text-blue-500 underline"
                  to={{
                    pathname: "/signup",
                    search: searchParams.toString(),
                  }}
                >
                  Sign up
                </Link>
              </div>
            </div>
          </Form>
        </Sign>
      </motion.div>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  console.log("Socorro");
  console.log(error instanceof Error);
  console.log("Não deu");

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1 className="text-red-500 font-bold">
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    )
  }
  else if (error instanceof LoginError) {
    return (
      <div>
        <h1 className="text-blue-500 font-bold ">
          Opa!
        </h1>
        <p>{error.message}</p>
      </div>
    )
  }
  else if (error instanceof Error) {
    return (
      <div>
        <h1 className="text-red-500">Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}