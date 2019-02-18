import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

import { GroupBy } from "./groupby.pipe";

@NgModule({
  declarations:[GroupBy],
  imports:[CommonModule],
  exports:[GroupBy]
})

export class MainPipe{}
