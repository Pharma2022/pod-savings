"use client"

import { PodForm } from "@/components/forms/PodForm"
import { drugsList } from "@/validation/drugs"

const Page = () => {
  return (
    <div>
      <PodForm drugList={drugsList}/>
    </div>
  )
}

export default Page