<template>
  <div class="h-full w-full flex flex-col lg:flex-row items-center justify-center p-4">
    <Particles />

    <div class="w-full max-w-[80rem] h-auto lg:h-[36rem] flex flex-col lg:flex-row">
      <!-- Left Section -->
      <div class="w-full lg:w-1/2 h-full flex justify-center flex-col items-center lg:items-start text-center lg:text-left">
        <ShuffleText text="SYCO" />
        <h2 class="text-gray-300 text-md sm:text-xl md:text-xl w-[80%] mt-4 lg:mt-0">
          Join Syco, Bangladesh's largest gaming community on Discord! <br>
          Syco is your ultimate hub for gaming, tournaments, and making new friends.
        </h2>
      </div>

      <!-- Right Section -->
      <div class="w-full lg:w-1/2 h-full p-2 flex items-center justify-center mt-8 lg:mt-0">
        <div class="bg-[#36393f] w-full max-w-[26rem] h-auto lg:h-full rounded-2xl flex items-center flex-col pt-10 lg:pt-20">
          <!-- Server Icon -->
          <div class="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 bg-black rounded-full flex items-center justify-center">
            <img src="https://cdn.discordapp.com/attachments/1328843479303979058/1345457708161302579/SYCO_eSports.png?ex=67c49ea3&is=67c34d23&hm=b457d181f2b8b80622a128ab581127f694da207a47661ac590ba583e3a87b91d&" alt="SYCO Logo" class="w-full h-full rounded-full">
          </div>

          <!-- Server Name -->
          <h2 class="text-white text-2xl sm:text-3xl font-semibold mt-6">SYCO</h2>

          <!-- Invite Description -->
          <p class="text-gray-400 text-sm sm:text-base mt-2 text-center px-4 lg:px-8">
            You've been invited to join a server. Click the button below to join!
          </p>

          <!-- Join Button -->
          <a
              href="https://discord.com/invite/sycovai"
              class="w-full max-w-[20rem] h-12 sm:h-14 bg-[#7289da] text-white rounded-xl mt-10 flex items-center justify-center hover:bg-[#677bc4] transition-colors"
              target="_blank"
              rel="noopener noreferrer"
          >
            Join Server
          </a>
        </div>
      </div>
    </div>
  </div>
</template>