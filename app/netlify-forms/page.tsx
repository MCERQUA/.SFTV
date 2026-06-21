export const dynamic = "force-static";

export default function NetlifyForms() {
  return (
    <div hidden>
      <form name="contact" data-netlify="true" netlify-honeypot="bot-field">
        <input type="hidden" name="form-name" value="contact" />
        <input name="bot-field" />
        <input name="name" />
        <input name="email" />
        <input name="phone" />
        <select name="inquiry_type"></select>
        <textarea name="message"></textarea>
      </form>
      <form name="quote" data-netlify="true" netlify-honeypot="bot-field">
        <input type="hidden" name="form-name" value="quote" />
        <input name="bot-field" />
        <input name="name" />
        <input name="email" />
        <input name="phone" />
        <select name="inquiry_type"></select>
        <textarea name="message"></textarea>
      </form>
    </div>
  );
}
