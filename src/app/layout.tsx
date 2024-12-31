export const metadata = {
  title: "Your Project Name - Join the Waitlist",
  description: "Be the first to know when we launch!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
