import { Link } from "react-router-dom";
import { EduQcmLogo } from "../components/shared/eduqcm-logo";
import { FeatureCard } from "../components/home/feature-card";
import PublicLayout from "~/components/layout/public-layout";
import "~/i18n.ts";
import { useTranslation } from "react-i18next";
import { BackgroundDecoration } from "../components/shared/background-decoration";
import { APP_ROUTES } from "~/constants/appRoutes";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
      <div className="text-lg font-bold">{value}</div>
      <div className="text-xs opacity-75">{label}</div>
    </div>
  );
}

export default function Home() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)]">
      <BackgroundDecoration />

      <div className="relative mx-auto max-w-6xl px-6 py-10">
        <PublicLayout
          pageTitle={t("home.title")}
          icon="icon/login/light.png"
          text={t("common.navigation.login")}
          link={APP_ROUTES.LOGIN}
        >
          {/* Hero */}
          <section className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1 text-xs">
                <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />
                {t("home.description")}
              </div>

              <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight">
                {t("home.pitch_part_1")}
                <span className="text-[var(--primary)]">{t("qcm")}</span>{" "}
                {t("home.pitch_part_2")}
              </h1>

              <p className="mt-4 text-base sm:text-lg opacity-85 leading-relaxed">
                <span className="font-semibold">EDUQCM</span>{" "}
                {t("home.description_long")}
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link
                  to={APP_ROUTES.LOGIN}
                  className="rounded-2xl px-5 py-3 font-semibold bg-[var(--primary)] text-[var(--border)] hover:opacity-90 transition text-center"
                >
                  {t("home.get_started")}
                </Link>
                <a
                  href="#benefits"
                  className="rounded-2xl px-5 py-3 font-semibold bg-[var(--background)] text-[var(--primary)]"
                >
                  {t("home.discover_benefits")}
                </a>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3 max-w-xl">
                <Stat
                  value={`⚡ ${t("home.fast")}`}
                  label={t("home.create_quiz_in_minutes")}
                />
                <Stat
                  value={`🎯 ${t("home.clear")}`}
                  label={t("home.readable_results")}
                />
                <Stat
                  value={`📚 ${t("home.practical")}`}
                  label={t("home.practical_for_revisions")}
                />
              </div>
            </div>

            {/* Showcase */}
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-xl backdrop-blur">
              <div className="flex items-center justify-between">
                <EduQcmLogo />
                <div className="text-xs opacity-70">
                  {t("home.examples_of_qcm")}
                </div>
              </div>

              <div className="mt-6 grid gap-3">
                {[
                  {
                    title: t("home.networks_basics"),
                    meta: "10 questions",
                  },
                  {
                    title: t("home.maths_probabilities"),
                    meta: "15 questions",
                  },
                  {
                    title: t("home.development_typescript"),
                    meta: "12 questions",
                  },
                ].map((q) => (
                  <div
                    key={q.title}
                    className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4"
                  >
                    <div className="text-sm font-semibold">{q.title}</div>
                    <div className="mt-2 text-sm opacity-80">{q.meta}</div>
                  </div>
                ))}

                <div className="mt-2 flex gap-2">
                  <Link
                    to={APP_ROUTES.LOGIN}
                    className="rounded-xl px-3 py-2 text-sm font-semibold border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--background)] transition"
                  >
                    Accéder
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Benefits */}
          <section id="benefits" className="mt-16">
            <h2 className="text-2xl font-bold">{t("home.what_you_gain")}</h2>
            <p className="mt-2 opacity-80 max-w-2xl">
              {t("home.what_you_gain_description")}
            </p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              <FeatureCard
                title={t("home.centralization_of_qcm")}
                desc={t("home.centralization_of_qcm_description")}
                icon={<span className="text-lg">📦</span>}
              />
              <FeatureCard
                title={t("home.easy_creation_maintenance")}
                desc={t("home.easy_creation_maintenance_description")}
                icon={<span className="text-lg">✍️</span>}
              />
              <FeatureCard
                title={t("home.clear_results")}
                desc={t("home.clear_results_description")}
                icon={<span className="text-lg">📊</span>}
              />
              <FeatureCard
                title={t("home.time_saving")}
                desc={t("home.time_saving_description")}
                icon={<span className="text-lg">⏱️</span>}
              />
              <FeatureCard
                title={t("home.for_teachers_and_students")}
                desc={t("home.for_teachers_and_students_description")}
                icon={<span className="text-lg">🎓</span>}
              />
              <FeatureCard
                title={t("home.solid_foundation_for_growth")}
                desc={t("home.solid_foundation_for_growth_description")}
                icon={<span className="text-lg">🧱</span>}
              />
            </div>
          </section>

          {/* Audience */}
          <section className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
              <h3 className="text-xl font-bold">{t("home.target_audience")}</h3>
              <ul className="mt-4 space-y-3 opacity-85">
                <li className="flex gap-3">
                  <span>👩‍🏫</span>
                  <span>
                    <span className="font-semibold">{t("teacher")}</span> :{" "}
                    {t("home.target_audience_description")}
                  </span>
                </li>
                <li className="flex gap-3">
                  <span>👨‍🎓</span>
                  <span>
                    <span className="font-semibold">{t("student")}</span> :{" "}
                    {t("home.student_description")}
                  </span>
                </li>
                <li className="flex gap-3">
                  <span>🏫</span>
                  <span>
                    <span className="font-semibold">{t("home.school")}</span> :{" "}
                    {t("home.school_description")}
                  </span>
                </li>
              </ul>
            </div>

            <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
              <h3 className="text-xl font-bold">
                {t("home.how_does_it_work")}
              </h3>
              <ol className="mt-4 space-y-3 opacity-85 list-decimal list-inside">
                <li>{t("home.step_1")}</li>
                <li>{t("home.step_2")}</li>
                <li>{t("home.step_3")}</li>
                <li>{t("home.step_4")}</li>
              </ol>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link
                  to={APP_ROUTES.LOGIN}
                  className="rounded-2xl px-5 py-3 font-semibold bg-[var(--primary)] text-[var(--border)] hover:opacity-90 transition text-center"
                >
                  {t("home.start_now")}
                </Link>
              </div>
            </div>
          </section>
        </PublicLayout>
      </div>
    </div>
  );
}
