# AhmadVid

تطبيق فيديو عربي مبني باستخدام React وVite وSupabase.

## إعداد تسجيل الدخول وقاعدة البيانات

1. أنشئ مشروعاً على [Supabase](https://supabase.com/).
2. افتح **SQL Editor** وشغّل محتوى `supabase/schema.sql`.
3. أنشئ ملفاً باسم `.env.local` في جذر المشروع:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_PUBLIC_KEY
```

استخدم مفتاح `anon` العام فقط في تطبيق الواجهة، ولا تضع `service_role` داخل المشروع أو GitHub.

## التشغيل

```bash
npm install
npm run dev
```

## الوظائف الجديدة

- إنشاء حساب وتسجيل الدخول بالبريد وكلمة المرور عبر Supabase Auth.
- تسجيل الخروج من زر الحساب.
- رفع ملفات MP4/WebM إلى Supabase Storage.
- حفظ بيانات الفيديو في جدول `videos` مع Row Level Security.
- تحميل الفيديوهات المنشورة من قاعدة البيانات، مع بيانات تجريبية عند عدم إعداد Supabase.

> الرفع يحتاج إعداد متغيرات البيئة وتشغيل ملف SQL أولاً. في الإنتاج يُنصح بإضافة حد لحجم الملفات، فحص نوع الملف، وإنشاء صور مصغرة عبر خدمة معالجة فيديو.
