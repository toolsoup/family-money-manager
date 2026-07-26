import * as React from 'react'
import { Nav } from 'fmm-design-system'

export const TopBar = () => (
  <div style={{ width: 720 }}>
    <Nav brand="Family Money">
      <a href="#" aria-current="page">
        Overview
      </a>
      <a href="#">What we own</a>
      <a href="#">Pay off debt</a>
      <a href="#">Money in and out</a>
      <a href="#">Goals</a>
    </Nav>
  </div>
)
