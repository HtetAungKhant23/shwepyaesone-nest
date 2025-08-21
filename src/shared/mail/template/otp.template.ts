export const otpTemplate = (code: number) => {
  return `
     <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Code</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">

    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin: 20px auto; max-width: 600px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
        <tr>
            <td align="center" style="padding: 20px 0; background-color: #007bff; border-top-left-radius: 10px; border-top-right-radius: 10px;">
                <h1 style="color: #ffffff; margin: 0;">Shwe Pyae Sone email verification OTP</h1>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px;">
                <p style="font-size: 16px; color: #333333; margin-bottom: 20px;">Use the following OTP to complete registeration:</p>
                <p style="font-size: 24px; font-weight: bold; color: #007bff; margin-bottom: 30px;">${code.toString()}</p>
                <p style="font-size: 16px; color: #333333; margin-bottom: 30px;">This OTP is valid for 1 minute from now. Please do not share this code with anyone.</p>
                <p style="font-size: 16px; color: #333333; margin-bottom: 30px;">If you did not request this OTP, please ignore this email or contact our support team.</p>
                <p style="font-size: 16px; color: #333333;">Thank you,<br>Shwe Pyae Sone</p>
            </td>
        </tr>
        <tr>
            <td align="center" style="padding: 20px; background-color: #f4f4f4; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;">
                <p style="font-size: 12px; color: #666666; margin: 0;">If you have any questions, feel free to <a href="mailto:spendwise.co@gmail.com" style="color: #007bff; text-decoration: none;">contact us</a>.</p>
                <p style="font-size: 12px; color: #666666; margin: 5px 0 0 0;">&copy; 2025 Shwe Pyae Sone. All rights reserved.</p>
            </td>
        </tr>
    </table>

</body>
</html>
      `;
};
