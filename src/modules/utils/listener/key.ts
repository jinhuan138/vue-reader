
/**
* Listen for key press
* @param {HTMLElement} el - The element to add event listeners to.
* @param {function} fn - The listener function.
*/

export default function keyListener(el:HTMLElement, fn:(dire:string)=>void) {
	el.addEventListener('keyup', (e:KeyboardEvent ) => {
		
		// Right or up arrow key indicates next 
		if (e.key === 'ArrowUp' || e.key === 'ArrowRight') { 
			fn('next');
		}
		// left or down arrow key indicates next 
		else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft' ){ 
			fn('prev')
		}
	}, false);

}