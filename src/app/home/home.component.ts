import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  sessionUser;
  isAdminUser = false;
  showContentUpload = false;
  imageData;
  genre = 'Select';
  language = 'Select';
  ratings = 'Select';
  filteredData;
  recentAdd;
  constructor(public dialogRef: MatDialog, private router: Router) { }

  ngOnInit() {
    if (window.location.pathname.split('/')[2]) {
      const existingData = JSON.parse(window.localStorage.getItem('Subscribers'));
      existingData.filter((res) => {
        if (res.uniqueId === window.location.pathname.split('/')[2]) {
          this.isAdminUser = res.type === 'admin' ? true : false;
          this.sessionUser = res;
        }
      });
    }

    this.imageData = JSON.parse(window.localStorage.getItem('contents'));
    this.filteredData = this.imageData;
  }

  onSearch(field) {
    this.filteredData = [];
    this.imageData.filter((res) => {
      if (field === 'genre') {
        if (this.genre === res.genre) {
          this.filteredData.push(res);
        }
      }
      if (field === 'language') {
        if (this.language === res.language) {
          this.filteredData.push(res);
        }
      }
      if (field === 'ratings') {
        if (this.ratings === '1-3') {
          if (res.ratings['1'] > 0 || res.ratings['2'] > 0 || res.ratings['3'] > 0) {
            this.filteredData.push(res);
          }
        } else if (this.ratings === '2-4') {
          if (res.ratings['12'] > 0 || res.ratings['3'] > 0 || res.ratings['4'] > 0) {
            this.filteredData.push(res);
          }
        } else if (this.ratings === '3-5') {
          if (res.ratings['3'] > 0 || res.ratings['4'] > 0 || res.ratings['5'] > 0) {
            this.filteredData.push(res);
          }
        }
      }
    });
  }

  sortByDate() {
    this.filteredData = this.imageData.sort((a: any, b: any) => {
      let value: any;
      if (this.recentAdd) {
        value = b.updatedDate - a.updatedDate;
        return value;
      } else {
        value = a.updatedDate - b.updatedDate;
        return value;
      }
    });
  }


  openUploadModel(value) {
    this.showContentUpload = value;
  }

  addRating(value, contentId) {
    let isUserEligibleForRating = false;
    if (this.imageData.length > 0) {
      this.imageData.filter((res) => {
        if (res.contentId === contentId) {
          isUserEligibleForRating = res.ratings.users.includes(this.sessionUser.uniqueId);
          if (!isUserEligibleForRating) {
            switch (value) {
              case 1:
                res.ratings['1'] = res.ratings['1'] + 1;
                break;
              case 2:
                res.ratings['2'] = res.ratings['1'] + 1;
                break;
              case 3:
                res.ratings['3'] = res.ratings['1'] + 1;
                break;
              case 4:
                res.ratings['4'] = res.ratings['1'] + 1;
                break;
              case 5:
                res.ratings['5'] = res.ratings['1'] + 1;
                break;
            }
            res.ratings.users.push(this.sessionUser.uniqueId);
            window.localStorage.setItem('contents', JSON.stringify(this.imageData));
            alert('your ratings added successfully');
          } else {
            alert('your ratings added already');
          }
        }
      });
    }

  }

  getData(event) {
    this.imageData = this.filteredData = event;
  }
  logout() {
    this.router.navigate(['']);
  }
}
