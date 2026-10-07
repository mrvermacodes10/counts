"use client";

import { useState, useTransition } from "react";
import { deleteCount, updateCount, type FieldErrors } from "@/app/(site)/admin/actions";
import { formatNumber } from "@/lib/format";
import { PEOPLE, PERSON_NAME, type Person } from "@/lib/people";
import type { Entry } from "@/lib/queries";
import { parseAmount, parsePerson } from "@/lib/validation";
import { PersonName } from "../PersonName";

type Mode = "view" | "edit" | "confirm-delete";

const NETWORK_ERROR = "The request didn't go through. Check your connection and try again.";

export function EntryRow({ entry }: { entry: Entry }) {
  const [mode, setMode] = useState<Mode>("view");
  const [person, setPerson] = useState<Person>(entry.person);
  const [amount, setAmount] = useState(String(entry.amount));
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const name = PERSON_NAME[entry.person];
  const errorId = `entry-${entry.id}-error`;

  function reset(next: Mode) {
    setPerson(entry.person);
    setAmount(String(entry.amount));
    setFieldErrors({});
    setError(null);
    setMode(next);
  }

  function save() {
    if (pending) return;
    const p = parsePerson(person);
    const a = parseAmount(amount);
    const errors: FieldErrors = {};
    if (!p.ok) errors.person = p.error;
    if (!a.ok) errors.amount = a.error;
    setFieldErrors(errors);
    if (!p.ok || !a.ok) {
      setError(errors.amount ?? errors.person ?? "Check this entry.");
      return;
    }
    if (p.value === entry.person && a.value === entry.amount) {
      reset("view");
      return;
    }

    const fd = new FormData();
    fd.set("id", String(entry.id));
    fd.set("person", p.value);
    fd.set("amount", String(a.value));
    setError(null);
    startTransition(async () => {
      try {
        const result = await updateCount(fd);
        if (result.ok) {
          setMode("view");
          setFieldErrors({});
        } else {
          setFieldErrors(result.fieldErrors ?? {});
          setError(result.error);
        }
      } catch {
        setError(NETWORK_ERROR);
      }
    });
  }

  function remove() {
    if (pending) return;
    const fd = new FormData();
    fd.set("id", String(entry.id));
    setError(null);
    startTransition(async () => {
      try {
        const result = await deleteCount(fd);
        if (!result.ok) setError(result.error);
      } catch {
        setError(NETWORK_ERROR);
      }
    });
  }

  const editing = mode === "edit";

  return (
    <tr
      className={`row--${entry.person.toLowerCase()}${editing ? " is-editing" : ""}${pending ? " is-pending" : ""}`}
      aria-busy={pending || undefined}
    >
      <td data-label="Count" className="cell-count">
        {editing ? (
          <input
            className={fieldErrors.amount ? "input input--compact has-error" : "input input--compact"}
            type="number"
            inputMode="numeric"
            min={1}
            step={1}
            value={amount}
            autoFocus
            aria-label="Count"
            aria-invalid={fieldErrors.amount ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            onChange={(e) => {
              setAmount(e.target.value);
              setFieldErrors((f) => ({ ...f, amount: undefined }));
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") save();
              if (e.key === "Escape") reset("view");
            }}
          />
        ) : (
          `+${formatNumber(entry.amount)}`
        )}
      </td>
      <td data-label="Person">
        {editing ? (
          <select
            className={fieldErrors.person ? "input input--compact has-error" : "input input--compact"}
            value={person}
            aria-label="Person"
            onChange={(e) => setPerson(e.target.value as Person)}
          >
            {PEOPLE.map((p) => (
              <option key={p} value={p}>
                {PERSON_NAME[p]}
              </option>
            ))}
          </select>
        ) : (
          <PersonName person={entry.person} />
        )}
      </td>
      <td data-label="Date" className="cell-muted">
        <time dateTime={entry.createdAt}>{entry.date}</time>
      </td>
      <td data-label="Time" className="cell-muted">
        <span>
          {entry.time}
          {entry.edited && !editing && <span className="edited-tag">Edited</span>}
        </span>
      </td>
      <td data-label="Actions" className="cell-actions">
        {mode === "view" && (
          <div className="row-actions">
            <button type="button" className="button button--small" onClick={() => reset("edit")}>
              Edit
            </button>
            <button
              type="button"
              className="button button--small button--danger-ghost"
              onClick={() => reset("confirm-delete")}
            >
              Delete
            </button>
          </div>
        )}
        {mode === "edit" && (
          <div className="row-actions">
            <button type="button" className="button button--small button--primary" onClick={save} disabled={pending}>
              {pending ? "Saving…" : "Save"}
            </button>
            <button type="button" className="button button--small" onClick={() => reset("view")} disabled={pending}>
              Cancel
            </button>
          </div>
        )}
        {mode === "confirm-delete" && (
          <div className="row-actions row-actions--confirm">
            <span className="confirm-text">
              Delete +{formatNumber(entry.amount)} for {name}?
            </span>
            <button type="button" className="button button--small button--danger" onClick={remove} disabled={pending}>
              {pending ? "Deleting…" : "Delete"}
            </button>
            <button type="button" className="button button--small" onClick={() => reset("view")} disabled={pending}>
              Cancel
            </button>
          </div>
        )}
        {editing && <p className="row-note">Date and time stay as originally recorded.</p>}
        {error && (
          <p className="field__error" id={errorId} role="alert">
            {error}
          </p>
        )}
      </td>
    </tr>
  );
}
