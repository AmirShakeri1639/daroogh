const printElem = (elem: string, title: string): void => {
    const mywindow = window.open('', 'PRINT', 'height=400,width=600')

    mywindow?.document.write('<html><head><title>' + title  + '</title>')
    mywindow?.document.write('</head><body >')
    mywindow?.document.write('<h1>' + title  + '</h1>')
    mywindow?.document.write(document?.getElementById(elem)?.innerHTML ?? '')
    mywindow?.document.write('</body></html>')

    mywindow?.document.close() // necessary for IE >= 10
    mywindow?.focus() // necessary for IE >= 10*/

    mywindow?.print()
    mywindow?.close()
}

export default printElem
