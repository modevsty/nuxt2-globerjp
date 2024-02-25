import { resolve } from 'path'

const icons = ['Account', 
      'ChevronLeft', 
      'ChevronRight',
      'MenuDown',
      'Close',
      'PlusCircle',
      'Pencil',
      'Download',
      'Home',
      'Rss',
    'FrequentlyAskedQuestions',
    'Earth',
  'Lock',
  'Eye',
  'EyeOff',
  'EmailOutline',
  'Camera',
  'Floppy']

export default function () {
	this.nuxt.hook('components:dirs', (dirs) => {
		dirs.push({
			path: resolve('node_modules/vue-material-design-icons'),
			prefix: 'Mdi',
			pattern: `**/@(${icons.join('|')}).vue`,
		})
	})
}