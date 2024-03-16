import epub from "epub"


export class EpubHelper {

    static async load(filePath: string, page: number=0) {
        try{

            return new Promise((resolve, reject) => {
                const book = new epub(filePath)
                
                book.on('end', ()=>{

                    book.getChapter(book.spine.contents[page].id, (err, data)=>{
                        if (err) {
                            console.log(err)
                            return
                        }

                        resolve(data)
                        //resolve(data.substring(0))
                    })

                })
                book.on('error', (err)=>{
                    reject(err)
                })
                book.parse()
            })

        }catch (error) {
            console.log(error)
            throw new Error('Error in open EPUB')
        }
    }



}