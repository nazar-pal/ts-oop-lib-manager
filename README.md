# Library Management System - OOP with TypeScript

A fun repository demonstrating **Object-Oriented Programming** concepts in TypeScript. This project showcases a Library Management System that implements various OOP principles including classes, inheritance, polymorphism, composition, encapsulation, and design patterns like Repository and Service layers.

## 🎯 Purpose

This project is designed to review and understand how Object-Oriented Programming works with TypeScript, featuring:

- **Classes & Constructors** - Author, Book, Member, Loan, and EBook classes
- **Inheritance** - EBook extends Book
- **Polymorphism** - Method overriding (e.g., `getInfo()`)
- **Composition** - Book contains Author, Loan contains Book & Member
- **Encapsulation** - Private properties with getters/setters
- **Static Properties** - Shared class-level data
- **Design Patterns** - Repository Pattern, Service Pattern, Dependency Injection
- **Database Integration** - SQLite with Drizzle ORM

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh) runtime installed (v1.3.2+)

### Installation

Install dependencies:

```bash
bun install
```

### Database Setup

Set the database file path as an environment variable:

```bash
export DB_FILE_NAME=./library.db
```

Or create a `.env` file:

```bash
DB_FILE_NAME=./library.db
```

### Running Migrations

Before running the application, you need to run the migrations to create the database. Migrations are already generated in the `drizzle/` directory:

```bash
DB_FILE_NAME=./library.db bun run migrate.ts
```

This will create the database file (`library.db`) and set up all the necessary tables.

### Running the Application

Execute the main entry point:

```bash
DB_FILE_NAME=./library.db bun run index.ts
```

Or run directly:

```bash
DB_FILE_NAME=./library.db bun index.ts
```

This will demonstrate various OOP concepts by creating authors, books, members, and loans, then performing operations like borrowing, returning, and calculating fines.

## 🛠️ Development Commands

### Type Checking

Run TypeScript type checking:

```bash
bunx tsc --noEmit
```

### Drizzle Studio

Open Drizzle Studio to visualize and interact with your database:

```bash
DB_FILE_NAME=./library.db bunx drizzle-kit studio
```

This will open a web interface (usually at `http://localhost:4983`) where you can browse tables, view data, and run queries.

## 🔄 Working with Migrations

For future development, when you modify the database schema:

### Generate Migrations

After modifying the schema in `src/db/schema.ts`, generate new migrations:

```bash
bunx drizzle-kit generate
```

### Run Migrations

Apply the generated migrations to your database:

```bash
DB_FILE_NAME=./library.db bun run migrate.ts
```

## 📁 Project Structure

```
src/
├── db/              # Database configuration and schema
│   ├── index.ts     # Drizzle database instance
│   ├── schema.ts    # Database schema definitions
│   └── types.ts     # Type definitions
├── models/          # Domain models (OOP classes)
│   ├── Author.ts
│   ├── Book.ts      # Base Book class
│   ├── Loan.ts
│   └── Member.ts
├── repositories/    # Data access layer (Repository Pattern)
│   ├── BaseRepository.ts
│   ├── AuthorRepository.ts
│   ├── BookRepository.ts
│   ├── LoanRepository.ts
│   └── MemberRepository.ts
├── services/        # Business logic layer (Service Pattern)
│   ├── LibraryService.ts
│   └── LoanService.ts
└── index.ts         # Main entry point with OOP demonstrations

drizzle/             # Generated migration files
migrate.ts           # Migration runner script
drizzle.config.ts    # Drizzle configuration
```

## 🎓 OOP Concepts Demonstrated

The main entry point (`src/index.ts`) demonstrates:

1. **Class Instantiation & Encapsulation** - Creating objects with private properties
2. **Composition** - Objects containing other objects (Book has Author)
3. **Inheritance & Polymorphism** - EBook extends Book with method overriding
4. **Static Properties** - Class-level shared data
5. **Getters & Setters** - Controlled property access
6. **Business Logic Methods** - Instance methods for domain operations
7. **Repository Pattern** - Separation of data access logic
8. **Service Pattern** - Separation of business logic
9. **Dependency Injection** - Constructor-based dependency management

## 📝 Notes

- The database file (`library.db`) is created when you run migrations
- All migrations are already generated and stored in the `drizzle/` directory
- The project uses Bun's built-in SQLite support with Drizzle ORM
- TypeScript strict mode is enabled for better type safety

## 🎉 Have Fun!

This is a learning project - feel free to explore the code, modify it, and experiment with different OOP patterns!
