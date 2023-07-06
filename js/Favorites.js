import { GithubUser } from './GithubUser.js'

//Aplicação distribuida em 2 classes, uma constroi a tabela e a outra a lógica dos dados. 
//Unindo através de herança.

//Classe que vai conter a lógica dos dados: como os dados serão estruturados

export class Favorites {
    
    constructor(root) {
      
        this.root = document.querySelector(root)
      
        this.load()

        GithubUser.search('isabelaghislandi').then(username => console.log(username))
    }

    load() {
      
        this.entries = JSON.parse(localStorage.getItem('@github-favorites:') ) || []
      
    }

    save() {
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
    }

    async add(username) {
        
        try { 
           
            const userExisted = this.entries.find(entry => entry.login === username )
            console.log(userExisted)

            if (userExisted) {
                throw new Error('usuario ja cadastrado')
            }
            
            const user = await GithubUser.search(username)

            if (user.login === undefined) {
                
                throw new Error('Usuario não encontrado')
            }

            this.entries = [user, ...this.entries]
            this.update()
            this.save()

        } catch (error) {
            alert(error.message)
        } 

    }

    
    delete(user) {
       
        const filteredEntries = this.entries.filter(entry =>  entry.login !== user.login) 
              
        this.entries = filteredEntries
        console.log(filteredEntries)
        this.update()
       
        this.save()
    }
}

//Classe que vai criar a visualização do html, eventos do html etc.
export class FavoritesView extends Favorites {
    constructor(root) {
        super(root)
        this.tbody = this.root.querySelector('table tbody')
        this.update()
        this.onadd()
    }

    onadd() {
        const addbutton = this.root.querySelector('.search button')
        addbutton.onclick = () => {
          
            const { value } = this.root.querySelector('.search input')

           this.add(value)
        }
    }

  
    update() {
       this.removeAllTr()

       this.entries.forEach( user => {

        console.log(user)
        
        const row = this.createRow()

        console.log(row)

        row.querySelector('.user img').src = `https://github.com/${user.login}.png`

        row.querySelector('.user img').alt = `Imagem de ${user.name}`
        row.querySelector('.user p').textContent = user.name
        row.querySelector('.user a').href = `https://github.com/${user.login}`
        row.querySelector('.user span').textContent = user.login
        row.querySelector('.repositories').textContent = user.public_repos
        row.querySelector('.followers').textContent = user.followers

       
        row.querySelector('.remove').onclick = () => {
           
            const isOk = confirm('Tem certeza que deseja deletar um linha?')
            if(isOk) {
              
                this.delete(user)
            }
        }

        this.tbody.append(row)
    })
       
    }

    createRow() { 
        const tr = document.createElement('tr')

        const content = `  
                    <td class="user">
                        <img src="https://github.com/isabelaghislandi.png" alt="Imagem de Isabela Ghislandi">
                        <a href="https://github.com/IsabelaGhislandi">
                            <p>Isabela Ghislandi</p>
                            <span>IsabelaGhislandi</span>
                        </a>
                    </td>
                    <td class="repositories">48</td>
                    <td class="followers">1</td>
                    <td>
                        <button class="remove">&times;</button>
                    </td>
                 `
        tr.innerHTML = content
        
        return tr
    }



    removeAllTr() {
       

        this.tbody.querySelectorAll('tr')
            .forEach((tr) => {
                console.log(tr)
                tr.remove()
            })
    }
}