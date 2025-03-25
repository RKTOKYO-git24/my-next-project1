import styels from "./page.module.css";
import ContactForm from "@/app/_components/ContactForm";

export default function Page() {
  return (
    <div className={styels.container}>
      <p className={styels.text}>
        If you have any questions or concerns, please contact us using the form
        below. After confirming the contents of the application, a
        representative will contact you usually within 3 business days.
      </p>
      <ContactForm />
    </div>
  );
}
