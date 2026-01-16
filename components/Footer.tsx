export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p className="text-gray-600 font-medium mb-2">
          Association des Nigériens Étudiants à Marrakech (ANEM)
        </p>
        <p className="text-sm text-gray-400">
          &copy; {new Date().getFullYear()} ANEM. Tous droits réservés.
        </p>
        
        <div className="flex justify-center gap-4 mt-4">
          <a href="#" className="text-gray-400 hover:text-green-700 transition">Facebook</a>
          <a href="#" className="text-gray-400 hover:text-green-700 transition">Instagram</a>
          <a href="#" className="text-gray-400 hover:text-green-700 transition">Contact</a>
        </div>
      </div>
    </footer>
  );
}