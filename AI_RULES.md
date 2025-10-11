# AI Rules for Project Development

This document outlines the core technologies used in this project and provides guidelines for library usage to ensure consistency, maintainability, and adherence to best practices.

## Tech Stack Description

This project is built using a modern web development stack, focusing on performance, developer experience, and a consistent UI.

*   **Vite**: A fast build tool that provides an instant development server and highly optimized builds.
*   **TypeScript**: A superset of JavaScript that adds static type definitions, enhancing code quality and developer productivity.
*   **React**: A declarative, component-based JavaScript library for building user interfaces.
*   **shadcn/ui**: A collection of beautifully designed, accessible, and customizable UI components built with Radix UI and Tailwind CSS.
*   **Tailwind CSS**: A utility-first CSS framework for rapidly building custom designs directly in your markup.
*   **React Router**: A standard library for client-side routing in React applications, enabling navigation between different views.
*   **TanStack Query (React Query)**: A powerful library for managing, caching, and synchronizing server state in React applications.
*   **Lucide React**: A comprehensive icon library that provides a wide range of customizable SVG icons.
*   **Sonner**: An elegant and accessible toast notification library for displaying ephemeral messages to users.
*   **React Hook Form & Zod**: Libraries for efficient form management and schema-based validation, respectively.

## Library Usage Rules

To maintain a cohesive and efficient codebase, please adhere to the following guidelines when developing new features or modifying existing ones:

*   **UI Components**: Always prioritize `shadcn/ui` components for building user interfaces. If a specific component is not available or requires significant customization beyond `shadcn/ui`'s capabilities, create a new, custom component using Tailwind CSS for styling and Radix UI primitives if complex interactions are needed. **Do not modify existing `shadcn/ui` component files directly.**
*   **Styling**: All styling must be done using **Tailwind CSS** utility classes. Avoid writing custom CSS in separate files or using inline styles, except for global styles defined in `src/index.css` or specific dynamic styles that cannot be expressed with Tailwind.
*   **Routing**: Use `react-router-dom` for all client-side navigation and route definitions. All main routes should be defined in `src/App.tsx`.
*   **Data Fetching & Server State Management**: For fetching, caching, and synchronizing server data, use `@tanstack/react-query`.
*   **Icons**: Integrate icons using the `lucide-react` library.
*   **Toast Notifications**: For displaying temporary, non-blocking messages to the user, use the `sonner` library.
*   **Form Management & Validation**: For handling forms, use `react-hook-form`. For schema validation, pair it with `zod` and `@hookform/resolvers`.
*   **Date Manipulation**: Any operations involving dates (formatting, parsing, calculations) should utilize `date-fns`.
*   **Carousels**: For implementing carousels or image sliders, use `embla-carousel-react`.
*   **Theme Management**: If theme switching is required, leverage `next-themes`.