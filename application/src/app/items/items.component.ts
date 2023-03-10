import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';

@Component({
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})

export class ItemsComponent {

  allChars: character[];
  curChar: character;
  allItems: Item[];
  viewSubmitted: Boolean;

  constructor(private http: HttpClient, private router: Router) {
    this.allChars = [];
    this.allItems = [];
    this.curChar = {} as character;
    this.viewSubmitted = false;
  }

  ngOnInit() {
    if (localStorage.getItem('id_token') === null) {
      this.router.navigateByUrl('/');
    }

    let Character = {
      "OwnerToken": localStorage.getItem('id_token'),
    };

    this.viewSubmitted = true;

    const options = { headers: { 'Content-Type': 'application/json' } };

    // Get all user characters
    this.http.post('http://localhost:8080/characters/get', JSON.stringify(Character), options).subscribe(data => {
      if (200) {
        if (data === null)
          return;
        var chars = JSON.parse(JSON.stringify(data));
        this.allChars.splice(0);
        for (var i = 0; i < chars.length; i++) {
          var char = new character(chars[i].Name, chars[i].Level, chars[i].ClassType, chars[i].Description, chars[i].CharacterID, chars[i].Items);
          this.allChars.push(char);
        }
      }
    }, (error) => {
      if (error.status === 404) {
        alert('Resource not found.');
      }
      else if (error.status === 409) {
        alert('Character already exists. Please try another one.');
      }
      else if (error.status === 500) {

        alert('Server down.');
      }
      else if (error.status === 502) {
        alert('Bad gateway.');
      }
    }
    );
  }

  // show all items owned and unowned for that class and level
  showItems() {

    const select = document.getElementById("chars") as HTMLSelectElement;
    const index = select.selectedIndex;

    // Get selected index 
    if (index === 0 || index === -1 || index -1 >= this.allChars.length)
      return;

    // Current character equals user's selected option'
    var char = this.allChars.at(index - 1)!;
    // Get all items
    let Items = {
      "AdminToken": localStorage.getItem('id_token'),
    };

    this.viewSubmitted = true;

    const options = { headers: { 'Content-Type': 'application/json' } };

    this.http.post('http://localhost:8080/items/get', JSON.stringify(Items), options).subscribe(data => {
      if (200) {
        var items = JSON.parse(JSON.stringify(data));
        this.allItems.splice(0);

        // Filter items with equal class and level with character

        for (var i = 0; i < items.length; i++) {

          if (items[i].LevelReq === char.Level && items[i].ClassReq === char.Class) {

            var item = new Item(items[i].Name, items[i].Description, items[i].LevelReq, items[i].ClassReq, items[i].ItemID);
            console.log(item);

            if (char.items.get(item.ID)) {
              item.Owned = true;
              // If item belongs to character, Owned should equal true
              char.items.get(item.ID)!.Owned = true;
            }
            this.allItems.push(item);
          }

        }
      }
    }, (error) => {
      if (error.status === 404) {
        alert('Resource not found.');
      }
      else if (error.status === 409) {
        alert('Item already exists. Please try another one.');
      }
      else if (error.status === 500) {

        alert('Server down.');
      }
      else if (error.status === 502) {
        alert('Bad gateway.');
      }
    }
    );
  }

  // These methods allow items to be shown as owned or unowned by a character
  itemOwned(item: Item): boolean {
    return item.Owned;
  }
  itemUnowned(item: Item): boolean {
    if (item.Owned === false)
      return true;

    else
      return false;
  }

  //  // Placeholder for Adding item to character
  add() {
    alert("Item added");
  }
}

// Character and item schema stored
class character {
  Name: string;
  Level: number;
  Class: number;
  Description: string;
  ID: number;
  items: Map<number, Item>;
  constructor(name: string, level: number, myclass: number, desc: string, id: number, allitems: Item[]) {

    this.Name = name;
    this.Level = level;
    this.Class = myclass;
    this.Description = desc;
    this.ID = id;
    this.items = new Map<number, Item>;

    if (allitems !== null)
      for (var i = 0; i < allitems.length; i++) {
        this.items.set(allitems[i].ID, allitems[i]);
      }
  }

}

class Item {
  Name: string;
  Description: string;
  Level: number;
  Class: number;
  ID: number;
  Owned: boolean;
  constructor(name: string, desc: string, level: number, myclass: number, id: number) {
    this.Owned = false;
    this.Name = name;
    this.Description = desc;
    this.Level = level;
    this.Class = myclass;
    this.ID = id;
  }
}
