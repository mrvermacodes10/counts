"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PERSON_COOKIE, PERSON_PATH } from "@/lib/people";
import { parsePerson } from "@/lib/validation";

/** "Who are you?" — not authentication, just which page to open first. */
export async function choosePerson(formData: FormData) {
  const person = parsePerson(formData.get("person"));
  if (!person.ok) redirect("/");

  const jar = await cookies();
  // No maxAge/expires → a session cookie, forgotten when the browser closes.
  jar.set(PERSON_COOKIE, person.value, {
    path: "/",
    sameSite: "lax",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  redirect(PERSON_PATH[person.value]);
}
