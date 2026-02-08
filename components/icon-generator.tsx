const ColorPicker = ({
    id,
    label,
    defaultValue,
}: {
    id: string
    label: string
    defaultValue: string
}) => {
    const swatches = [
        '#000000',
        '#ffffff',
        '#ef4444',
        '#f97316',
        '#eab308',
        '#22c55e',
        '#14b8a6',
        '#3b82f6',
        '#8b5cf6',
        '#ec4899',
        '#6b7280',
        '#1f2937',
    ]

    return (
        <div>
            <label class="block text-sm font-medium text-foreground mb-1.5">{label}</label>
            <div class="relative">
                <button
                    type="button"
                    id={`${id}-trigger`}
                    class="w-full h-10 px-3 flex items-center gap-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                    <div
                        id={`${id}-preview`}
                        class="h-5 w-5 rounded-sm border border-border shrink-0"
                        style={`background-color: ${defaultValue}`}
                    ></div>
                    <span id={`${id}-value`} class="flex-1 text-left text-sm font-mono">
                        {defaultValue}
                    </span>
                </button>
                <input type="color" id={`${id}-native`} value={defaultValue} class="sr-only" />
                <div
                    id={`${id}-popover`}
                    class="absolute z-50 mt-1 w-64 p-3 rounded-lg border border-border bg-popover text-popover-foreground shadow-lg hidden"
                >
                    <div class="grid grid-cols-6 gap-1.5 mb-3">
                        {swatches.map((color) => (
                            <button
                                type="button"
                                data-color={color}
                                class={`${id}-swatch h-7 w-7 rounded-md border border-border hover:scale-110 transition-transform cursor-pointer`}
                                style={`background-color: ${color}`}
                            ></button>
                        ))}
                    </div>
                    <div class="flex gap-2">
                        <button
                            type="button"
                            id={`${id}-eyedropper`}
                            class="h-9 w-9 flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent transition-colors shrink-0"
                            title="Pick from screen"
                        >
                            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="m2 22 1-1h3l9-9" />
                                <path d="M3 21v-3l9-9" />
                                <path d="m15 6 3.5-3.5a2.12 2.12 0 1 1 3 3L18 9l.5.5-1.5 1.5-.5-.5-4 4-3-3 4-4-.5-.5L14.5 5.5l.5.5Z" />
                            </svg>
                        </button>
                        <input
                            type="text"
                            id={`${id}-input`}
                            value={defaultValue}
                            class="flex-1 h-9 px-3 text-sm font-mono rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                            placeholder="#000000"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export const IconGenerator = () => (
    <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl font-bold text-foreground mb-8">Icon Generator</h1>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="rounded-xl border border-border bg-card text-card-foreground shadow-sm p-6">
                <h2 class="text-lg font-semibold text-foreground mb-4">Settings</h2>
                <div id="settings-form" class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-foreground mb-1.5">Width</label>
                            <input
                                type="number"
                                id="width"
                                value="100"
                                min="1"
                                max="4096"
                                class="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-foreground mb-1.5">Height</label>
                            <input
                                type="number"
                                id="height"
                                value="100"
                                min="1"
                                max="4096"
                                class="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-foreground mb-1.5">Text</label>
                        <input
                            type="text"
                            id="text"
                            value="Hello"
                            maxLength={1000}
                            class="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-foreground mb-1.5">Font Size</label>
                        <input
                            type="number"
                            id="fontSize"
                            value="32"
                            min="8"
                            max="500"
                            class="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <ColorPicker id="color" label="Color" defaultValue="#000000" />
                        <ColorPicker id="backgroundColor" label="Background" defaultValue="#ffffff" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-foreground mb-1.5">Font</label>
                        <select
                            id="font"
                            class="w-full h-10 px-3 pr-10 rounded-md border border-input bg-background text-foreground appearance-none bg-no-repeat focus:outline-none focus:ring-2 focus:ring-ring"
                            style={`background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E"); background-position: right 0.75rem center;`}
                        >
                            <option value="Inter">Inter</option>
                            <option value="Noto Sans KR">Noto Sans KR</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-foreground mb-1.5">Google Fonts</label>
                        <input
                            type="text"
                            id="googleFont"
                            placeholder="Enter Google Font name (e.g., Roboto)"
                            class="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                        <p id="fontMessage" class="mt-1.5 text-sm text-muted-foreground hidden"></p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-foreground mb-1.5">Font Weight</label>
                        <select
                            id="fontWeight"
                            class="w-full h-10 px-3 pr-10 rounded-md border border-input bg-background text-foreground appearance-none bg-no-repeat focus:outline-none focus:ring-2 focus:ring-ring"
                            style={`background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E"); background-position: right 0.75rem center;`}
                        >
                            <option value="100">100 (Thin)</option>
                            <option value="200">200 (Extra Light)</option>
                            <option value="300">300 (Light)</option>
                            <option value="400" selected>
                                400 (Normal)
                            </option>
                            <option value="500">500 (Medium)</option>
                            <option value="600">600 (Semi Bold)</option>
                            <option value="700">700 (Bold)</option>
                            <option value="800">800 (Extra Bold)</option>
                            <option value="900">900 (Black)</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-foreground mb-1.5">Icon</label>
                        <select
                            id="icon"
                            class="w-full h-10 px-3 pr-10 rounded-md border border-input bg-background text-foreground appearance-none bg-no-repeat focus:outline-none focus:ring-2 focus:ring-ring"
                            style={`background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E"); background-position: right 0.75rem center;`}
                        >
                            <option value="">None</option>
                            <option value="ts">TypeScript</option>
                            <option value="js">JavaScript</option>
                            <option value="react">React</option>
                            <option value="vue">Vue</option>
                            <option value="svelte">Svelte</option>
                            <option value="next">Next.js</option>
                            <option value="nuxt">Nuxt</option>
                            <option value="node">Node.js</option>
                            <option value="express">Express</option>
                            <option value="java">Java</option>
                            <option value="spring">Spring</option>
                            <option value="docker">Docker</option>
                            <option value="git">Git</option>
                            <option value="github">GitHub</option>
                            <option value="tailwind">Tailwind</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-foreground mb-1.5">Icon URL</label>
                        <input
                            type="text"
                            id="iconUrl"
                            placeholder="https://example.com/icon.svg"
                            class="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                        <p class="mt-1 text-xs text-muted-foreground">Custom icon URL (overrides icon selection)</p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-foreground mb-1.5">Icon Size</label>
                        <input
                            type="number"
                            id="iconSize"
                            value="0"
                            min="0"
                            max="500"
                            placeholder="Auto"
                            class="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                        <p class="mt-1 text-xs text-muted-foreground">0 = auto size based on height</p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-foreground mb-1.5">Tailwind Classes</label>
                        <input
                            type="text"
                            id="tailwind"
                            placeholder="e.g., rounded-lg shadow-md"
                            class="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-foreground mb-1.5">Custom CSS (JSON)</label>
                        <textarea
                            id="css"
                            placeholder='e.g., {"borderRadius": "10px"}'
                            rows={2}
                            class="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        ></textarea>
                        <p id="cssError" class="mt-1.5 text-sm text-destructive hidden"></p>
                    </div>
                    <div id="validationErrors" class="hidden">
                        <div class="p-3 rounded-md border border-destructive/50 bg-destructive/10 text-destructive text-sm"></div>
                    </div>
                </div>
            </div>
            <div class="rounded-xl border border-border bg-card text-card-foreground shadow-sm p-6">
                <h2 class="text-lg font-semibold text-foreground mb-4">Preview</h2>
                <div id="preview-container" class="flex items-center justify-center rounded-lg border border-border bg-muted/50 min-h-64 p-4">
                    <div id="loading-spinner" class="hidden">
                        <div class="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
                    </div>
                    <img
                        id="preview-image"
                        src="/api/image?width=100&height=100&text=Hello&font=Inter&fontSize=32&fontWeight=400&color=%23000000&backgroundColor=%23ffffff"
                        alt="Preview"
                        class="max-w-full max-h-64 object-contain"
                    />
                    <div id="error-container" class="hidden text-center">
                        <p class="text-destructive mb-3">Failed to load preview</p>
                        <button
                            id="retry-button"
                            class="h-9 px-4 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                </div>
                <div class="mt-6 flex flex-wrap gap-2">
                    <button
                        id="download-button"
                        class="h-9 px-4 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                        Download PNG
                    </button>
                    <button
                        id="copy-url-button"
                        class="h-9 px-4 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                        Copy API URL
                    </button>
                    <button
                        id="copy-markdown-button"
                        class="h-9 px-4 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                        Copy as Markdown
                    </button>
                </div>
                <p id="copy-feedback" class="mt-2 text-sm text-green-600 hidden"></p>
            </div>
        </div>
    </div>
)
