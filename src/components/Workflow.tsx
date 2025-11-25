import { workflowList } from "@/lib/data";

export function Workflow() {
  return (
    <div className="px-[10%] py-16 mt-10 bg-white">
      <div className="w-full">
        <div className="overflow-hidden flex flex-row -ml-4">
          {workflowList.map((item, index) => (
            <div
              key={index}
              className="md:basis-1/2 lg:basis-1/4 min-w-0 shrink-0 grow-0 basis-full pl-4"
            >
              <div className="bg-white rounded-md h-64">
                <div
                  className={`h-10 w-full ${item.color} rounded-t-md relative`}
                >
                  <div className="h-10 w-10 bg-white absolute bottom-[-15px] left-3 rounded-md p-1">
                    <img src={item.img} alt="" />
                  </div>
                </div>
                <div className="p-3 pt-6">
                  <h5 className="mb-2 text-lg font-bold tracking-tight">
                    {item.title}
                  </h5>
                  <p className="mb-3 font-normal text-gray-700">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
