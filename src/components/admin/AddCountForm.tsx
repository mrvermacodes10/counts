"use client";

import { useState, useTransition } from "react";
import { addCount, type FieldErrors } from "@/app/(site)/admin/actions";
import { PEOPLE, PERSON_NAME, type Person } from "@/lib/people";
import { parseAmount, parsePerson } from "@/lib/validation";

type Status = { kind: "success" | "error"; text: string } | null;

const NETWORK_ERROR = "The request didn't go through. Check your connection and try again.";

export function AddCountForm() {
  const [person, setPerson] = useState<Person | "">("");
  const [amount, setAmount] = useState("1");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pending) return;

    // Instant feedback in the browser; the server validates again before saving.
    const p = parsePerson(person);
    const a = parseAmount(amount);
    const errors: FieldErrors = {};
    if (!p.ok) errors.person = p.error;
    if (!a.ok) errors.amount = a.error;
    setFieldErrors(errors);
    if (!p.ok || !a.ok) {
      setStatus({ kind: "error", text: "Fix the highlighted fields." });
      return;
    }

    const formData = new FormData();
    formData.set("person", p.value);
    formData.set("amount", String(a.value));

    setStatus(null);
    startTransition(async () => {
      try {
        const result = await addCount(formData);
        if (result.ok) {
          setAmount("1");
          setFieldErrors({});
          setStatus({ kind: "success", text: result.message });
        } else {
          setFieldErrors(result.fieldErrors ?? {});
          setStatus({ kind: "error", text: result.error });
        }
      } catch {
        setStatus({ kind: "error", text: NETWORK_ERROR });
      }
    });
  }

  return (
    <form className="add-form" onSubmit={onSubmit} noValidate>
      <fieldset className="field" aria-describedby={fieldErrors.person ? "add-person-error" : undefined}>
        <legend className="field__label">Person</legend>
        <div className={fieldErrors.person ? "segmented has-error" : "segmented"}>
          {PEOPLE.map((p) => (
            <label key={p} className="segmented__option">
              <input
                type="radio"
                name="person"
                value={p}
                checked={person === p}
                onChange={() => {
                  setPerson(p);
                  setFieldErrors((f) => ({ ...f, person: undefined }));
                  setStatus(null);
                }}
              />
              <span>{PERSON_NAME[p]}</span>
            </label>
          ))}
        </div>
        {fieldErrors.person && (
          <p className="field__error" id="add-person-error">
            {fieldErrors.person}
          </p>
        )}
      </fieldset>

      <div className="field field--amount">
        <label className="field__label" htmlFor="add-amount">
          Count
        </label>
        <input
          id="add-amount"
          className={fieldErrors.amount ? "input has-error" : "input"}
          type="number"
          inputMode="numeric"
          min={1}
          step={1}
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            setFieldErrors((f) => ({ ...f, amount: undefined }));
            setStatus(null);
          }}
          aria-invalid={fieldErrors.amount ? true : undefined}
          aria-describedby={fieldErrors.amount ? "add-amount-error" : undefined}
        />
        {fieldErrors.amount && (
          <p className="field__error" id="add-amount-error">
            {fieldErrors.amount}
          </p>
        )}
      </div>

      <div className="add-form__submit">
        <button type="submit" className="button button--primary" disabled={pending}>
          {pending ? "Adding…" : "Add count"}
        </button>
      </div>

      <p
        className={status ? `form-status form-status--${status.kind}` : "form-status"}
        role="status"
        aria-live="polite"
      >
        {status?.text ?? ""}
      </p>
      <p className="add-form__note">Date and time are recorded automatically when you add a count.</p>
    </form>
  );
}
