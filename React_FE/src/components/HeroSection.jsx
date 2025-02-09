import React from "react";

export default function HeroSection({ user }) {
  return (
    <section className="bg-gradient-to-r from-tertiary to-accent1 text-white text-center py-16">
      <h1 className="text-4xl font-bold mb-4">Chào mừng trở lại, {user?.name}!</h1>
      <p className="text-xl mb-6">Hãy tiếp tục hành trình học tập của bạn.</p>
      <button className="bg-white text-primary font-bold py-2 px-6 rounded-full hover:bg-opacity-90 transition">
        Tiếp tục học
      </button>
    </section>
  );
}
