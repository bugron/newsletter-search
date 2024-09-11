export function removeElements(root, elementsToRemove) {
    for (const element of elementsToRemove) {
        const elements = root.querySelectorAll(element);
        for (const element of elements) {
            element.remove();
        }
    }
}
