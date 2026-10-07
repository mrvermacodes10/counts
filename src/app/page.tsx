import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PEOPLE, PERSON_COOKIE, PERSON_NAME, PERSON_PATH, isPerson } from "@/lib/people";
import { choosePerson } from "./actions";

export const dynamic = "force-dynamic";

export default async function WhoAreYou() {
  // Already chose this session → go straight to their page.
  const saved = (await cookies()).get(PERSON_COOKIE)?.value;
  if (isPerson(saved)) redirect(PERSON_PATH[saved]);

  return (
    <main className="picker">
      <div className="picker__inner">
        <p className="picker__wordmark">COUNTS</p>
        <h1 className="picker__question">Who are you?</h1>
        <form action={choosePerson} className="picker__choices">
          {PEOPLE.map((p) => (
            <button key={p} type="submit" name="person" value={p} className="picker__choice">
              {PERSON_NAME[p]}
            </button>
          ))}
        </form>
      </div>
    </main>
  );
}
