import { createCookieSessionStorage, redirect } from "@remix-run/node"; 

export const sessionStorage = createCookieSessionStorage({
    cookie: {
        name: "__session",
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        secrets: [ENV.SESSION_SECRET],
        secure: ENV.NODE_ENV === 'production'
    }
});

const USER_SESSION_KEY = "userId";

export async function getSession(request: Request) {
    const cookie = request.headers.get("Cookie");
    return sessionStorage.getSession(cookie);
}

// This type is just to show the return  of get user behind
export type User ={
    id: string;
    name: string;
}

export async function getUserId(
    request: Request
): Promise<User["id"] | undefined> {
    const session = await getSession(request);
    const userId = session.get(USER_SESSION_KEY);
    return userId;
}
  
export async function getUser(request: Request) {
    const userId = await getUserId(request);
    if (userId === undefined) return null;
  
    // getUserById is a prisma function ->
    // const user = await getUserById(userId);
    // if (user) return user;
  
    throw await logout(request);
}

//#region Login/SignUp
export async function createUserSession({
    request,
    userId,
    remember,
    redirectTo,
  }: {
    request: Request;
    userId: string;
    remember: boolean;
    redirectTo: string;
  }) {
    const session = await getSession(request);
    session.set(USER_SESSION_KEY, userId);
    return redirect(redirectTo, {
      headers: {
        "Set-Cookie": await sessionStorage.commitSession(session, {
          maxAge: remember
            ? 60 * 60 * 24 * 7 // 7 days
            : undefined,
        }),
      },
    });
}
//#endregion Login/SignUp

//#region  Logout
export async function logout(request: Request) {
    const session = await getSession(request);
    return redirect("/", {
      headers: {
        "Set-Cookie": await sessionStorage.destroySession(session),
      },
    });
}
//#endregion Logout

  