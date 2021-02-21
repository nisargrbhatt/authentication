import { ProfileService } from './../../profile.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';

import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-profile-photo',
  templateUrl: './profile-photo.component.html',
  styleUrls: ['./profile-photo.component.scss'],
})
export class ProfilePhotoComponent implements OnInit {
  form: FormGroup;
  imagePreview: string;
  imagePath: string;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { image: string; name: string },
    public dialogRef: MatDialogRef<ProfilePhotoComponent>,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      photo: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
    });
    this.imagePath = this.data.image;
    this.imagePreview = this.data.image;
  }
  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ photo: file });
    this.form.get('photo').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
  async onSetPhoto() {
    if (this.form.invalid) {
      return;
    }
    if (typeof this.form.value.photo === 'object') {
      let imageData = new FormData();
      imageData.append('photo', this.form.value.photo, this.data.name);
      await this.profileService.setPhoto(imageData);
      this.dialogRef.close();
    } else {
      let imageData = {
        photo: this.imagePath,
      };
      await this.profileService.setPhoto(imageData);
      this.dialogRef.close();
    }
  }
}
