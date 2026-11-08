export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json();

    const inputUser = (body.username || '').trim();
    const inputPass = body.password || '';

    // خواندن متغیرهای محیطی از تنظیمات Cloudflare Pages
    const validUser = env.ADMIN_USER;
    const validPass = env.ADMIN_PASS;

    if (!validUser || !validPass) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: 'متغیرهای محیطی ADMIN_USER و ADMIN_PASS در پنل Cloudflare Pages تعریف نشده‌اند.'
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json;charset=UTF-8' }
        }
      );
    }

    if (inputUser === validUser && inputPass === validPass) {
      return new Response(
        JSON.stringify({ ok: true }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json;charset=UTF-8' }
        }
      );
    }

    return new Response(
      JSON.stringify({
        ok: false,
        error: 'نام کاربری یا رمز عبور ادمین معتبر نیست.'
      }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' }
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ ok: false, error: 'درخواست نامعتبر است.' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' }
      }
    );
  }
}
