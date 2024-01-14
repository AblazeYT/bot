export default function getFetch() {
    return import('node-fetch').then((module) => module.default);
}