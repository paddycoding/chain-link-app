import os
import urllib.request
from fpdf import FPDF

FONT_FILE = "DejaVuSans.ttf"
FONT_URL = "https://github.com/dejavu-fonts/dejavu-fonts/raw/master/ttf/DejaVuSans.ttf"

# Download font if missing
if not os.path.exists(FONT_FILE):
    print(f"Downloading {FONT_FILE}...")
    urllib.request.urlretrieve(FONT_URL, FONT_FILE)
    print("Font downloaded.")

def clean_text(text):
    return (
        text.replace("’", "'")
            .replace("“", '"')
            .replace("”", '"')
            .replace("→", "->")
    )

flashcards = [
    {
        "question": "What’s the difference between `==` and `.equals()` in Java?",
        "answer": (
            "`==` checks if two references point to the same object in memory.\n"
            "`.equals()` compares the actual content of objects (if overridden).\n\n"
            "Example:\n"
            "String a = new String(\"hello\");\n"
            "String b = new String(\"hello\");\n"
            "a == b -> false (different references)\n"
            "a.equals(b) -> true (content is the same)"
        )
    },
    {
        "question": "What are the four OOP principles in Java?",
        "answer": (
            "1. Encapsulation – Using access modifiers (private, public) to hide data.\n"
            "2. Abstraction – Exposing only essential details via interfaces or abstract classes.\n"
            "3. Inheritance – A class derives from another class to reuse code.\n"
            "4. Polymorphism – Same method name behaves differently based on object type."
        )
    },
    {
        "question": "Explain Java memory model: stack vs heap.",
        "answer": (
            "Stack stores local primitives and references, organized in frames per method call.\n"
            "Heap stores all objects and instance variables.\n"
            "Stack is fast and short-lived; heap is larger and GC-managed."
        )
    },
    {
        "question": "What is the difference between checked and unchecked exceptions?",
        "answer": (
            "Checked exceptions must be declared or caught (e.g. IOException).\n"
            "Unchecked exceptions extend RuntimeException and don't require declaration (e.g. NullPointerException).\n"
            "Checked exceptions represent recoverable conditions."
        )
    },
    {
        "question": "What is the difference between an interface and an abstract class?",
        "answer": (
            "Interface: declares methods without implementations (Java 8+ allows default methods).\n"
            "Abstract class: can have both abstract methods and concrete implementations.\n"
            "Classes can implement multiple interfaces but extend only one abstract class."
        )
    },
    {
        "question": "What does 'final' mean in Java?",
        "answer": (
            "'final' variable = constant, can only be assigned once.\n"
            "'final' method = cannot be overridden.\n"
            "'final' class = cannot be subclassed."
        )
    },
    {
        "question": "Explain the concept of Java Generics.",
        "answer": (
            "Generics enable types (classes/interfaces) to be parameters when defining classes, methods.\n"
            "They provide type safety and eliminate the need for casting.\n"
            "Example: List<String> ensures only Strings can be added."
        )
    },
    {
        "question": "What is the Java Collections Framework?",
        "answer": (
            "A set of classes and interfaces for storing and manipulating groups of objects.\n"
            "Includes List, Set, Map, Queue, and their implementations like ArrayList, HashSet, HashMap."
        )
    },
    {
        "question": "What is the difference between ArrayList and LinkedList?",
        "answer": (
            "ArrayList uses a dynamic array, fast random access, slower inserts/removals (except at the end).\n"
            "LinkedList uses doubly-linked nodes, slower random access, fast insertions/removals anywhere."
        )
    },
    {
        "question": "Explain 'synchronized' in Java.",
        "answer": (
            "'synchronized' keyword controls access to blocks or methods to make them thread-safe.\n"
            "It ensures only one thread can execute the synchronized code at a time for the same object lock."
        )
    },
    {
        "question": "What is a Java Stream and why use it?",
        "answer": (
            "Streams provide a functional approach to processing sequences of elements.\n"
            "Supports operations like filter, map, reduce in a concise way.\n"
            "Helps write readable, parallelizable code."
        )
    },
    {
        "question": "Explain the difference between '==', '.equals()', and 'hashCode()' in Java.",
        "answer": (
            "'==' compares object references (memory addresses).\n"
            "'.equals()' compares logical equality, can be overridden for custom comparison.\n"
            "'hashCode()' returns an int used in hashing structures; equals objects must have same hashCode."
        )
    },
    {
        "question": "What is a Java lambda expression?",
        "answer": (
            "A lambda is a concise way to represent an anonymous function.\n"
            "Syntax: `(parameters) -> expression` or `(parameters) -> { statements }`\n"
            "Used mainly with functional interfaces for cleaner code."
        )
    },
    {
        "question": "Explain object references vs object content.",
        "answer": (
            "Object reference is a variable holding the memory address of an object.\n"
            "Object content refers to the actual data/state inside the object.\n"
            "'==' compares references; '.equals()' usually compares content."
        )
    }
]

pdf = FPDF()
pdf.add_page()

pdf.add_font('DejaVu', '', FONT_FILE, uni=True)
pdf.set_font('DejaVu', '', 12)

for card in flashcards:
    pdf.set_font('DejaVu', 'B', 12)
    pdf.multi_cell(0, 10, f"Q: {clean_text(card['question'])}")
    pdf.set_font('DejaVu', '', 12)
    pdf.multi_cell(0, 10, f"A: {clean_text(card['answer'])}\n")
    pdf.ln(5)

pdf.output("Java_Interview_Flashcards.pdf")
print("✅ PDF generated: Java_Interview_Flashcards.pdf")
