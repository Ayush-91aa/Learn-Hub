export const courses = [
    {
        id: 'python',
        title: 'Python',
        icon: '🐍',
        accentColor: '#F0C040',
        description: 'Learn Python from scratch to advanced',
        lessons: [
            {
                id: 1, title: 'Part 1: Introduction to Python', duration: '12:30', videoUrl: 'https://www.youtube.com/embed/XIR20HH8mNY', notes: {
                    title: 'Introduction to Python',
                    sections: [
                        {
                            heading: 'What is Python?',
                            content: 'Python is a popular programming language. It was created by Guido van Rossum, and released in 1991.\n\nIt is used for:\n• Web development (server-side)\n• Software development\n• Mathematics\n• System scripting'
                        },
                        {
                            heading: 'What can Python do?',
                            content: '• Python can be used on a server to create web applications.\n• Python can be used alongside software to create workflows.\n• Python can connect to database systems. It can also read and modify files.\n• Python can be used to handle big data and perform complex mathematics.\n• Python can be used for rapid prototyping, or for production-ready software development.'
                        },
                        {
                            heading: 'Why Python?',
                            content: '• Python works on different platforms (Windows, Mac, Linux, Raspberry Pi, etc).\n• Python has a simple syntax similar to the English language.\n• Python has syntax that allows developers to write programs with fewer lines than some other programming languages.\n• Python runs on an interpreter system, meaning that code can be executed as soon as it is written. This means that prototyping can be very quick.\n• Python can be treated in a procedural way, an object-oriented way or a functional way.'
                        },
                        {
                            heading: 'Good to Know',
                            content: 'The most recent major version of Python is Python 3, which we shall be using in this tutorial.\n\nIn this tutorial Python will be written in a text editor. It is possible to write Python in an Integrated Development Environment, such as Thonny, Pycharm, Netbeans or Eclipse which are particularly useful when managing larger collections of Python files.'
                        },
                        {
                            heading: 'Python Syntax vs Other Languages',
                            content: 'Python was designed for readability, and has some similarities to the English language with influence from mathematics.\n\n• Python uses new lines to complete a command, as opposed to other programming languages which often use semicolons or parentheses.\n• Python relies on indentation, using whitespace, to define scope; such as the scope of loops, functions and classes. Other programming languages often use curly-brackets for this purpose.'
                        },
                    ]
                }
            },
            { id: 2, title: 'Part 2: Setup & Installation', duration: '08:45', videoUrl: 'https://www.youtube.com/embed/fDZAizOsmZg' },
            {
                id: 3, title: 'Part 3: Python Basics', duration: '18:20', videoUrl: 'https://www.youtube.com/embed/DInMru2Eq6E', notes: {
                    title: 'Introduction to Python',
                    sections: [
                        {
                            heading: 'Overview',
                            content: 'Python is a high-level, interpreted programming language known for its simplicity, readability, and versatility. It is widely used for web development, data science, machine learning, automation, and more. Python\'s syntax resembles English, making it beginner-friendly.'
                        },
                        {
                            heading: 'Core Concepts',
                            content: 'Variables & Data Types: Variables store data and are dynamically typed (no need to declare type).\n• int: Whole numbers (e.g., 5, -3)\n• float: Decimal numbers (e.g., 3.14, -0.001)\n• str: Text enclosed in quotes (e.g., "Hello", \'Python\')\n• bool: Boolean values (True, False)\n• None: Represents absence of value\n\nOperators:\n• Arithmetic: +, -, *, /, //, %, **\n• Comparison: ==, !=, <, >, <=, >=\n• Logical: and, or, not\n\nControl Flow:\n• if, elif, else for conditional execution\n• for and while loops for iteration\n• break, continue, pass for loop control'
                        },
                        {
                            heading: 'Functions & Structure',
                            content: '• Functions are defined using def and can have parameters, default values, and return statements.\n• Use docstrings to document functions.\n• Indentation defines code blocks — critical in Python (no braces).\n• Scope: Variables are either global (outside functions) or local (inside functions). Use global keyword to modify global variables.'
                        },
                        {
                            heading: 'Built-in Data Structures',
                            content: '• List: Ordered, mutable, indexed with [] (e.g., [1, 2, 3])\n• Tuple: Ordered, immutable, indexed with () (e.g., (1, 2))\n• String: Sequence of characters, immutable, supports slicing and methods like .lower(), .split()\n• Dictionary: Key-value pairs, mutable, indexed with {} (e.g., {"name": "Alice"})\n• Set: Unordered, unique elements, mutable, {1, 2, 3}'
                        },
                        {
                            heading: 'Input/Output & File Handling',
                            content: '• Use input() to get user input (returns string), and print() to display output.\n• Typecast with int(), float(), or str() as needed.\n• Read/write files using open(), read(), write(), and context managers (with).'
                        },
                        {
                            heading: 'Key Principles',
                            content: '• Dynamic Typing: Variables can change type during execution.\n• Object-Oriented: Everything is an object; supports classes and inheritance.\n• Readable Syntax: Emphasis on clean, readable code with consistent indentation.'
                        },
                    ]
                }
            },
            { id: 4, title: 'Part 4: Variables & Data Types', duration: '15:10' },
            { id: 5, title: 'Part 5: Control Flow', duration: '20:05' },
            { id: 6, title: 'Part 6: Functions', duration: '22:40' },
            { id: 7, title: 'Part 7: Lists & Dictionaries', duration: '19:15' },
            { id: 8, title: 'Part 8: Object-Oriented Programming', duration: '28:30' },
        ],
    },
    {
        id: 'cpp',
        title: 'C++',
        icon: '⚙️',
        accentColor: '#58A6FF',
        description: 'Master C++ for systems programming',
        lessons: [
            { id: 1, title: 'Part 1: Introduction to C++', duration: '14:00' },
            { id: 2, title: 'Part 2: Setup & Compiler', duration: '10:20' },
            { id: 3, title: 'Part 3: C++ Basics', duration: '16:45' },
            { id: 4, title: 'Part 4: Pointers & Memory', duration: '24:10' },
            { id: 5, title: 'Part 5: Classes & Objects', duration: '21:30' },
            { id: 6, title: 'Part 6: Inheritance', duration: '18:55' },
            { id: 7, title: 'Part 7: STL & Templates', duration: '25:00' },
        ],
    },
    {
        id: 'llm',
        title: 'LLM',
        icon: '🤖',
        accentColor: '#BC8CF2',
        description: 'Understand Large Language Models',
        lessons: [
            { id: 1, title: 'Part 1: Introduction to LLMs', duration: '16:00' },
            { id: 2, title: 'Part 2: Transformer Architecture', duration: '22:30' },
            { id: 3, title: 'Part 3: Tokenization & Embeddings', duration: '19:45' },
            { id: 4, title: 'Part 4: Fine-Tuning Models', duration: '28:10' },
            { id: 5, title: 'Part 5: Prompt Engineering', duration: '17:20' },
            { id: 6, title: 'Part 6: RAG Systems', duration: '30:00' },
        ],
    },
    {
        id: 'html',
        title: 'HTML',
        icon: '🌐',
        accentColor: '#FF7B54',
        description: 'Build the structure of the web',
        lessons: [
            { id: 1, title: 'Part 1: Introduction to HTML', duration: '10:00' },
            { id: 2, title: 'Part 2: Setup & First Page', duration: '07:30' },
            { id: 3, title: 'Part 3: HTML Basics', duration: '14:20' },
            { id: 4, title: 'Part 4: Forms & Inputs', duration: '16:45' },
            { id: 5, title: 'Part 5: Semantic HTML', duration: '13:10' },
            { id: 6, title: 'Part 6: HTML5 Features', duration: '18:00' },
        ],
    },
    {
        id: 'css',
        title: 'CSS',
        icon: '🎨',
        accentColor: '#00D4AA',
        description: 'Style beautiful, responsive layouts',
        lessons: [
            { id: 1, title: 'Part 1: Introduction to CSS', duration: '11:00' },
            { id: 2, title: 'Part 2: Selectors & Properties', duration: '14:30' },
            { id: 3, title: 'Part 3: Box Model', duration: '12:45' },
            { id: 4, title: 'Part 4: Flexbox Layout', duration: '20:10' },
            { id: 5, title: 'Part 5: CSS Grid', duration: '22:30' },
            { id: 6, title: 'Part 6: Animations & Transitions', duration: '17:00' },
            { id: 7, title: 'Part 7: Responsive Design', duration: '19:20' },
        ],
    },
    {
        id: 'javascript',
        title: 'JavaScript',
        icon: '⚡',
        accentColor: '#F778BA',
        description: 'Power the web with JavaScript',
        lessons: [
            { id: 1, title: 'Part 1: Introduction to JavaScript', duration: '13:00' },
            { id: 2, title: 'Part 2: Setup & Console', duration: '09:15' },
            { id: 3, title: 'Part 3: JS Basics', duration: '17:40' },
            { id: 4, title: 'Part 4: DOM Manipulation', duration: '21:00' },
            { id: 5, title: 'Part 5: Events & Listeners', duration: '18:30' },
            { id: 6, title: 'Part 6: Async & Promises', duration: '24:10' },
            { id: 7, title: 'Part 7: ES6+ Features', duration: '20:45' },
            { id: 8, title: 'Part 8: Fetch API & JSON', duration: '16:20' },
        ],
    },
];

export const getCourseById = (id) => courses.find((c) => c.id === id);
