export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-10">
      <h1 className="text-4xl font-bold text-green-700 mb-4">
        ANEM - Section Marrakech
      </h1>
      <p className="text-xl text-gray-700 text-center max-w-2xl">
        Bienvenue sur la plateforme officielle de l'Association des Nigériens Étudiants et Stagiaires au Maroc.
      </p>
      
      {/* Bouton provisoire pour tester */}
      <button className="mt-8 px-6 py-3 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition">
        Rejoindre la communauté
      </button>
    </main>
  );
}