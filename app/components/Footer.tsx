export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="max-w-4xl mx-auto px-4 text-center text-sm">
        &copy; {new Date().getFullYear()} MyTodoApp. All rights reserved.
      </div>
    </footer>
  )
}