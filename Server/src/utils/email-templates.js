const BRAND = {
  name: "Event Ticketing System",
  accent: "#10b981",
  dark: "#0f172a",
  accentBorder: "#e0f2fe",
  gradient: "linear-gradient(135deg, #6366F1, #8B5CF6)",
};

const createDetailsRows = (rows) => {
  if (!rows?.length) return "";
  return rows
    .map(
      ({ label, value }) => `
      <tr>
        <td
          style="padding: 10px 0; font-size: 14px; color: #64748B; border-bottom: 1px solid #E5E7EB;"
        >
          ${label}
        </td>
        <td
          style="padding: 10px 0; font-size: 14px; color: ${BRAND.dark}; font-weight: 600; border-bottom: 1px solid #E5E7EB; text-align: right;"
        >
          ${value}
        </td>
      </tr>
    `
    )
    .join("\n");
};

const renderButton = ({ text, url }) => {
  if (!text || !url) return "";
  return `
    <tr>
      <td style="padding-top: 20px;" align="center">
        <a
          href="${url}"
          target="_blank"
          rel="noreferrer"
          style="
            display: inline-block;
            padding: 12px 28px;
            border-radius: 999px;
            background: ${BRAND.accent};
            color: #fff;
            font-weight: 600;
            font-size: 14px;
            text-decoration: none;
          "
        >
          ${text}
        </a>
      </td>
    </tr>
  `;
};

const wrapTemplate = ({
  preheader,
  title,
  subtitle,
  details,
  button,
  footerNote,
}) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>${title}</title>
  </head>
  <body
    style="
      margin: 0;
      padding: 0;
      background-color: #0b1220;
      font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
    "
  >
    <span
      style="
        display: none;
        font-size: 1px;
        color: #0b1220;
        line-height: 1px;
        max-height: 0;
        max-width: 0;
        opacity: 0;
        overflow: hidden;
      "
    >
      ${preheader}
    </span>
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center" style="padding: 32px 16px;">
          <table
            width="100%"
            border="0"
            cellspacing="0"
            cellpadding="0"
            style="max-width: 600px; border-radius: 24px; overflow: hidden; box-shadow: 0 30px 80px rgba(15, 23, 42, 0.3);"
          >
            <tr>
              <td
                align="center"
                style="
                  padding: 32px;
                  background: ${BRAND.gradient};
                  color: #f8fafc;
                  text-align: center;
                "
              >
                <p
                  style="
                    margin: 0;
                    font-size: 12px;
                    letter-spacing: 0.4em;
                    text-transform: uppercase;
                    color: rgba(255, 255, 255, 0.8);
                    margin-bottom: 12px;
                  "
                >
                  ${BRAND.name}
                </p>
                <h1 style="margin: 0; font-size: 28px; letter-spacing: -0.02em;">
                  ${title}
                </h1>
                ${subtitle ? `<p style="margin-top: 8px; font-size: 14px; color: rgba(255, 255, 255, 0.9);">${subtitle}</p>` : ""}
              </td>
            </tr>
            <tr>
              <td style="background: #fff; padding: 32px; color: ${BRAND.dark};">
                <p style="margin: 0 0 16px; font-size: 15px; color: #47535c;">
                  Hi there,
                </p>
                <p style="margin: 0 0 20px; font-size: 15px; color: #47535c;">
                  ${subtitle || "Here's an update from your Event Ticketing System account."}
                </p>
                <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="border-collapse: collapse;">
                  ${createDetailsRows(details)}
                </table>
                ${renderButton(button)}
                <p style="margin-top: 30px; font-size: 12px; color: #94a3b8;">
                  ${footerNote ||
                    `Need help? Reply to this email or reach out to hello@eventsystem.app.`}
                </p>
              </td>
            </tr>
          </table>
          <p style="margin-top: 16px; font-size: 12px; color: #94a3b8; text-align: center;">
            © ${new Date().getFullYear()} ${BRAND.name}. All rights reserved.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

const formatDate = (value) => {
  if (!value) return "TBA";
  const date = new Date(value);
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const bookingConfirmationTemplate = ({
  userName,
  eventName,
  date,
  ticketCount,
  location,
  url,
}) =>
  wrapTemplate({
    preheader: `Booking confirmed for ${eventName}`,
    title: "Booking Confirmed",
    subtitle: `${ticketCount} seat${ticketCount === 1 ? "" : "s"} are waiting for you!`,
    details: [
      { label: "Event", value: eventName },
      { label: "Date", value: formatDate(date) },
      { label: "Location", value: location || "To be announced" },
      { label: "Tickets", value: `${ticketCount} ticket${ticketCount === 1 ? "" : "s"}` },
    ],
    button: {
      text: "View event details",
      url,
    },
    footerNote: `Thanks for choosing ${BRAND.name}. We'll ping you with reminders before the show.`,
  });

const cancellationTemplate = ({
  userName,
  eventName,
  date,
  ticketCount,
  location,
  url,
}) =>
  wrapTemplate({
    preheader: `Booking cancelled for ${eventName}`,
    title: "Booking Cancelled",
    subtitle: `Your ${ticketCount} ticket${ticketCount === 1 ? "" : "s"} are released.`,
    details: [
      { label: "Event", value: eventName },
      { label: "Date", value: formatDate(date) },
      { label: "Location", value: location || "To be announced" },
      { label: "Tickets", value: `${ticketCount} ticket${ticketCount === 1 ? "" : "s"}` },
    ],
    button: {
      text: "Browse upcoming events",
      url,
    },
    footerNote: `If you need help, our support team is ready at hello@eventsystem.app.`,
  });

module.exports = {
  bookingConfirmationTemplate,
  cancellationTemplate,
};
