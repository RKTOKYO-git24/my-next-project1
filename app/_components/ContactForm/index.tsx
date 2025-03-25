"use client";

import { createContactData } from "@/app/_actions/contact";
import { useActionState } from "react";
import styles from "./index.module.css";

const initialState = {
  status: "",
  message: "",
};

export default function ContactForm() {
  const [state, formAction] = useActionState(createContactData, initialState);
  console.log(state);
  if (state?.status === "success") {
    return (
      <p className={styles.success}>
        Thank you for your inquiry.
        <br />
        Please wait a moment for our reply.
      </p>
    );
  }

  return (
    <form className={styles.form} action={formAction}>
      <div className={styles.horizontal}>
        <div className={styles.item}>
          <label className={styles.label} htmlFor="lastname">
            LAST NAME
          </label>
          <input
            className={styles.textfield}
            type="text"
            id="lastname"
            name="lastname"
          />
        </div>

        <div className={styles.item}>
          <label className={styles.label} htmlFor="firstname">
            FIRST NAME
          </label>
          <input
            className={styles.textfield}
            type="text"
            id="firstname"
            name="firstname"
          />
        </div>
      </div>

      <div className={styles.item}>
        <label className={styles.label} htmlFor="company">
          COMPANY NAME
        </label>
        <input
          className={styles.textfield}
          type="text"
          id="company"
          name="company"
        />
      </div>
      <div className={styles.item}>
        <label className={styles.label} htmlFor="email">
          EMAIL ADDRESS
        </label>
        <input
          className={styles.textfield}
          type="text"
          id="email"
          name="email"
        />
      </div>
      <div className={styles.item}>
        <label className={styles.label} htmlFor="message">
          MESSAGE
        </label>
        <textarea className={styles.textarea} id="message" name="message" />
      </div>
      <div className={styles.actions}>
        {state?.status === "error" && (
          <p className={styles.error}>{state.message}</p>
        )}
        <input type="submit" value="SUBMIT" className={styles.button} />
      </div>
    </form>
  );
}
